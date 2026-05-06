"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, FileText, CheckCircle2, AlertCircle, Activity, Sparkles, Save, RefreshCw } from "lucide-react";
import { Button, Card } from "@/components/ui/core";
import { analyzeFoodImage, type NutritionInfo } from "@/lib/gemini/analyze";
import { saveMealToFirestore } from "@/lib/firebase/meals";

const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AnalyzePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      setError("Unsupported file type. Please upload a JPG, PNG, WebP, or HEIC image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
      return;
    }

    setImageFile(file);
    setError(null);
    setResult(null);
    setIsSaved(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image file."));
    });
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setError(null);
    setIsSaved(false);

    try {
      const base64 = await convertToBase64(imageFile);
      const data = await analyzeFoodImage(base64, imageFile.type);
      setResult(data);

      // Persist to Firestore (non-blocking — failures won't affect UX)
      try {
        const docId = await saveMealToFirestore(data);
        if (docId) setIsSaved(true);
      } catch (saveErr) {
        console.warn("[Firestore] Save failed, continuing without persistence:", saveErr);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err?.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Analyze Your Meal</h1>
      <p className="text-muted-foreground mb-8">Upload a photo to instantly get a nutritional breakdown.</p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} className="text-primary" aria-hidden="true" />
            Upload Photo
          </h2>

          <div
            className="border-2 border-dashed border-[var(--border)] rounded-xl h-64 flex flex-col items-center justify-center bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer overflow-hidden relative focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            role="button"
            tabIndex={0}
            aria-label="Click or press Enter to select an image for analysis"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleImageSelect}
              aria-label="Select food image for nutritional analysis"
            />

            {imagePreview ? (
              <img src={imagePreview} alt="Preview of selected food image" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                <Upload size={32} className="text-muted-foreground mb-3" aria-hidden="true" />
                <p className="font-medium">Click to select an image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, HEIC — max 5MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-500 text-sm" role="alert">
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              className="w-full"
              disabled={!imageFile || isAnalyzing}
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              aria-label={isAnalyzing ? "Analyzing your meal with AI" : "Analyze the uploaded image"}
            >
              {isAnalyzing ? "Analyzing with AI..." : "Analyze Image"}
            </Button>
            {imageFile && !isAnalyzing && (
              <Button variant="outline" onClick={handleClear} aria-label="Clear selected image">
                Clear
              </Button>
            )}
          </div>

          {/* Retry button when an error occurs */}
          {error && imageFile && !isAnalyzing && (
            <Button
              variant="outline"
              className="w-full mt-3 gap-2"
              onClick={handleAnalyze}
              aria-label="Retry meal analysis"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Retry Analysis
            </Button>
          )}

          {/* Live region for screen readers */}
          <div className="sr-only" role="status" aria-live="polite">
            {isAnalyzing && "Analyzing your meal with AI. Please wait."}
            {result && `Analysis complete. ${result.name} detected with ${result.calories} calories.`}
            {isSaved && "Meal saved to your history."}
          </div>
        </Card>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {result ? (
            <>
              <Card className="p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10" aria-hidden="true" />
                <h2 className="text-2xl font-bold mb-1 pr-12">{result.name}</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  Analysis Complete
                </div>
                {isSaved && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 mb-4">
                    <Save size={12} aria-hidden="true" />
                    Saved to your history
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" role="list" aria-label="Nutritional breakdown">
                  <div className="bg-secondary/50 p-4 rounded-xl text-center" role="listitem">
                    <p className="text-2xl font-bold">{result.calories}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Calories</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center" role="listitem">
                    <p className="text-2xl font-bold text-blue-500">{result.protein}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Protein</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center" role="listitem">
                    <p className="text-2xl font-bold text-amber-500">{result.carbs}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Carbs</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center" role="listitem">
                    <p className="text-2xl font-bold text-red-400">{result.fat}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Fat</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity size={16} className="text-primary" aria-hidden="true" />
                      Health Score
                    </h3>
                    <span className="text-xl font-bold">{result.healthScore}/100</span>
                  </div>
                  <div
                    className="w-full bg-secondary rounded-full h-3"
                    role="progressbar"
                    aria-valuenow={result.healthScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Health score: ${result.healthScore} out of 100`}
                  >
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${
                        result.healthScore > 75 ? "bg-green-500" : result.healthScore > 40 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.healthScore}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-accent" aria-hidden="true" />
                  AI Insights
                </h3>
                <p className="text-foreground/90 leading-relaxed text-sm">
                  {result.insights}
                </p>

                <h3 className="font-semibold mt-6 mb-3 text-sm">Detected Ingredients</h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Detected ingredients">
                  {result.ingredients.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-xs font-medium" role="listitem">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed border-2">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground" aria-hidden="true">
                <Sparkles size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Awaiting Image</h3>
              <p className="text-muted-foreground max-w-sm">
                Upload a photo of your meal on the left and click Analyze. Our AI will break down the nutritional content for you.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
