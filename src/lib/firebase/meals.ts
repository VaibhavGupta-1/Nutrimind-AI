import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { NutritionInfo } from "@/lib/gemini/analyze";

export interface MealRecord extends NutritionInfo {
  id: string;
  createdAt: Date;
}

/**
 * Save a meal analysis result to Firestore.
 * Falls back gracefully if Firebase is not configured.
 */
export async function saveMealToFirestore(meal: NutritionInfo): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "mealHistory"), {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      ingredients: meal.ingredients,
      healthScore: meal.healthScore,
      insights: meal.insights,
      createdAt: serverTimestamp(),
    });
    console.log("[Firestore] Meal saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Failed to save meal:", error);
    // Don't crash the app — Firestore persistence is non-critical
    return null;
  }
}

/**
 * Fetch the most recent meal history from Firestore.
 * Returns an empty array if Firebase is not configured.
 */
export async function getMealHistory(maxResults: number = 20): Promise<MealRecord[]> {
  try {
    const q = query(
      collection(db, "mealHistory"),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    const meals: MealRecord[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      meals.push({
        id: doc.id,
        name: data.name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        ingredients: data.ingredients || [],
        healthScore: data.healthScore,
        insights: data.insights,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
      });
    });

    return meals;
  } catch (error) {
    console.error("[Firestore] Failed to fetch meal history:", error);
    return [];
  }
}
