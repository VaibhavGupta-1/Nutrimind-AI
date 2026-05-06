"use client";

import React from "react";
import { Activity, Flame, Utensils, Droplets, TrendingUp, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Card, Button } from "@/components/ui/core";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data for the UI
  const todayStats = {
    calories: 1450,
    caloriesGoal: 2200,
    protein: 85,
    proteinGoal: 150,
    carbs: 120,
    carbsGoal: 250,
    fat: 45,
    fatGoal: 70,
    healthScore: 82,
  };

  const recentMeals = [
    { id: 1, name: "Grilled Salmon Salad", calories: 420, score: 95, time: "Today, 1:30 PM" },
    { id: 2, name: "Avocado Toast & Eggs", calories: 380, score: 88, time: "Today, 9:00 AM" },
    { id: 3, name: "Chicken Stir Fry", calories: 550, score: 75, time: "Yesterday, 7:45 PM" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Guest!</h1>
          <p className="text-muted-foreground mt-1">Here's your nutritional summary for today.</p>
        </div>
        <Link href="/analyze">
          <Button className="gap-2 shadow-md shadow-primary/20">
            <Utensils size={18} />
            Log New Meal
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Main Score Card */}
        <Card className="p-6 md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} />
          </div>
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary" />
            Daily Health Score
          </h3>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-8 border-secondary">
              {/* Simplified circle progress, in a real app use an SVG circle with stroke-dasharray */}
              <div 
                className="absolute inset-[-8px] rounded-full border-8 border-primary rounded-t-full rounded-r-full rounded-bl-full"
                style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)' }} // Approx 82%
              />
              <div className="text-center">
                <span className="text-5xl font-bold text-foreground">{todayStats.healthScore}</span>
                <span className="text-xl font-semibold text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="mt-4 font-medium text-primary">Excellent Status</p>
          </div>
        </Card>

        {/* Macros Summary */}
        <Card className="p-6 md:col-span-2">
          <h3 className="font-semibold text-lg mb-6">Macronutrients</h3>
          
          <div className="space-y-6">
            {/* Calories */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  Calories
                </span>
                <span className="text-sm font-medium">{todayStats.calories} / {todayStats.caloriesGoal} kcal</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(todayStats.calories/todayStats.caloriesGoal)*100}%` }}></div>
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  Protein
                </span>
                <span className="text-sm font-medium">{todayStats.protein} / {todayStats.proteinGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(todayStats.protein/todayStats.proteinGoal)*100}%` }}></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  Carbs
                </span>
                <span className="text-sm font-medium">{todayStats.carbs} / {todayStats.carbsGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(todayStats.carbs/todayStats.carbsGoal)*100}%` }}></div>
              </div>
            </div>

            {/* Fat */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  Fat
                </span>
                <span className="text-sm font-medium">{todayStats.fat} / {todayStats.fatGoal} g</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${(todayStats.fat/todayStats.fatGoal)*100}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Meals History */}
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <CalendarIcon size={20} />
        Recent Meals
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {recentMeals.map((meal) => (
          <Card key={meal.id} className="p-5 hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{meal.name}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                meal.score > 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
                {meal.score}
              </span>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-sm text-muted-foreground">{meal.time}</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <Flame size={14} className="text-orange-500" />
                {meal.calories}
              </span>
            </div>
          </Card>
        ))}
        
        <Card className="p-5 flex flex-col items-center justify-center text-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors border-dashed cursor-pointer">
          <Link href="/analyze" className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-secondary p-3 rounded-full mb-2">
              <Utensils size={20} />
            </div>
            <span className="font-medium">Log Another Meal</span>
          </Link>
        </Card>
      </div>
    </div>
  );
}
