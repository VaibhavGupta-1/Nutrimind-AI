"use client";

import React, { useEffect, useState } from "react";
import { Activity, Flame, Utensils, Droplets, TrendingUp, Calendar as CalendarIcon, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Card, Button } from "@/components/ui/core";
import Link from "next/link";
import { getMealHistory, type MealRecord } from "@/lib/firebase/meals";

export default function DashboardPage() {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await getMealHistory(10);
        setMeals(history);
      } catch (err) {
        console.error("Failed to load meal history:", err);
        setError("Could not load your meal history. Please check your Firebase configuration.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // Compute aggregated daily stats from Firestore meals
  const todayStats = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMeals = meals.filter((m) => {
      const mealDate = new Date(m.createdAt);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });

    const totals = todayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
        scoreSum: acc.scoreSum + m.healthScore,
        count: acc.count + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, scoreSum: 0, count: 0 }
    );

    return {
      calories: totals.calories,
      caloriesGoal: 2200,
      protein: totals.protein,
      proteinGoal: 150,
      carbs: totals.carbs,
      carbsGoal: 250,
      fat: totals.fat,
      fatGoal: 70,
      healthScore: totals.count > 0 ? Math.round(totals.scoreSum / totals.count) : 0,
      mealCount: totals.count,
    };
  }, [meals]);

  const scoreLabel =
    todayStats.healthScore >= 80
      ? "Excellent Status"
      : todayStats.healthScore >= 50
        ? "Good Progress"
        : todayStats.healthScore > 0
          ? "Keep Going"
          : "No Meals Logged";

  const formatTime = (date: Date) => {
    const now = new Date();
    const mealDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mealDay = new Date(mealDate);
    mealDay.setHours(0, 0, 0, 0);

    const timeStr = mealDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (mealDay.getTime() === today.getTime()) return `Today, ${timeStr}`;
    if (mealDay.getTime() === yesterday.getTime()) return `Yesterday, ${timeStr}`;
    return mealDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${timeStr}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Guest!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your nutritional summary for today.
          </p>
        </div>
        <Link href="/analyze">
          <Button className="gap-2 shadow-md shadow-primary/20" aria-label="Log a new meal analysis">
            <Utensils size={18} aria-hidden="true" />
            Log New Meal
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Main Score Card */}
        <Card className="p-6 md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
            <Activity size={120} />
          </div>
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary" aria-hidden="true" />
            Daily Health Score
          </h3>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className="relative h-40 w-40 flex items-center justify-center rounded-full border-8 border-secondary"
              role="meter"
              aria-valuenow={todayStats.healthScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Daily health score: ${todayStats.healthScore} out of 100`}
            >
              <div 
                className="absolute inset-[-8px] rounded-full border-8 border-primary"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)`,
                }}
                aria-hidden="true"
              />
              <div className="text-center">
                <span className="text-5xl font-bold text-foreground">{todayStats.healthScore}</span>
                <span className="text-xl font-semibold text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="mt-4 font-medium text-primary">{scoreLabel}</p>
            {todayStats.mealCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Based on {todayStats.mealCount} meal{todayStats.mealCount > 1 ? "s" : ""} today
              </p>
            )}
          </div>
        </Card>

        {/* Macros Summary */}
        <Card className="p-6 md:col-span-2">
          <h3 className="font-semibold text-lg mb-6">Macronutrients</h3>
          
          <div className="space-y-6" role="list" aria-label="Macronutrient progress">
            {/* Calories */}
            <div role="listitem">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" aria-hidden="true" />
                  Calories
                </span>
                <span className="text-sm font-medium">{todayStats.calories} / {todayStats.caloriesGoal} kcal</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5" role="progressbar" aria-valuenow={todayStats.calories} aria-valuemax={todayStats.caloriesGoal} aria-label={`Calories: ${todayStats.calories} of ${todayStats.caloriesGoal}`}>
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((todayStats.calories / todayStats.caloriesGoal) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Protein */}
            <div role="listitem">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" aria-hidden="true" />
                  Protein
                </span>
                <span className="text-sm font-medium">{todayStats.protein} / {todayStats.proteinGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5" role="progressbar" aria-valuenow={todayStats.protein} aria-valuemax={todayStats.proteinGoal} aria-label={`Protein: ${todayStats.protein}g of ${todayStats.proteinGoal}g`}>
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((todayStats.protein / todayStats.proteinGoal) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Carbs */}
            <div role="listitem">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" aria-hidden="true" />
                  Carbs
                </span>
                <span className="text-sm font-medium">{todayStats.carbs} / {todayStats.carbsGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5" role="progressbar" aria-valuenow={todayStats.carbs} aria-valuemax={todayStats.carbsGoal} aria-label={`Carbs: ${todayStats.carbs}g of ${todayStats.carbsGoal}g`}>
                <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((todayStats.carbs / todayStats.carbsGoal) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Fat */}
            <div role="listitem">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
                  Fat
                </span>
                <span className="text-sm font-medium">{todayStats.fat} / {todayStats.fatGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5" role="progressbar" aria-valuenow={todayStats.fat} aria-valuemax={todayStats.fatGoal} aria-label={`Fat: ${todayStats.fat}g of ${todayStats.fatGoal}g`}>
                <div className="bg-red-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((todayStats.fat / todayStats.fatGoal) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Meals History */}
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <CalendarIcon size={20} aria-hidden="true" />
        Recent Meals
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-16" role="status" aria-label="Loading meal history">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="sr-only">Loading meal history...</span>
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <AlertCircle size={32} className="mx-auto text-red-400 mb-3" aria-hidden="true" />
          <p className="text-muted-foreground">{error}</p>
        </Card>
      ) : meals.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto text-muted-foreground" aria-hidden="true">
            <Utensils size={28} />
          </div>
          <h4 className="text-lg font-semibold mb-2">No Meals Logged Yet</h4>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Start by uploading a photo of your meal to get AI-powered nutritional analysis.
          </p>
          <Link href="/analyze">
            <Button className="gap-2" aria-label="Go to meal analysis page">
              <Utensils size={18} aria-hidden="true" />
              Analyze Your First Meal
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-4" role="list" aria-label="Recent meal history">
          {meals.map((meal) => (
            <Card key={meal.id} className="p-5 hover:border-primary/50 transition-colors group" role="listitem">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{meal.name}</h4>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-md ${
                    meal.healthScore > 80
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : meal.healthScore > 50
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                  aria-label={`Health score: ${meal.healthScore}`}
                >
                  {meal.healthScore}
                </span>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm text-muted-foreground">
                  <time dateTime={new Date(meal.createdAt).toISOString()}>
                    {formatTime(meal.createdAt)}
                  </time>
                </span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Flame size={14} className="text-orange-500" aria-hidden="true" />
                  {meal.calories} kcal
                </span>
              </div>
            </Card>
          ))}
          
          <Card className="p-5 flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors border-dashed cursor-pointer">
            <Link href="/analyze" className="w-full h-full flex flex-col items-center justify-center" aria-label="Log another meal">
              <div className="bg-secondary p-3 rounded-full mb-2" aria-hidden="true">
                <Utensils size={20} />
              </div>
              <span className="font-medium">Log Another Meal</span>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
