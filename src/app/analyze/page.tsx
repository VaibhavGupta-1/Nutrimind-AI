"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, FileText, CheckCircle2, AlertCircle, Activity, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui/core";
import { analyzeFoodImage, type NutritionInfo } from "@/lib/gemini/analyze";

export default function AnalyzePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    
    setImageFile(file);
    setError(null);
    setResult(null);
    
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
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64 = await convertToBase64(imageFile);
      // Wait for dummy auth or real auth, then analyze
      const data = await analyzeFoodImage(base64, imageFile.type);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Ensure your Gemini API key is valid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Analyze Your Meal</h1>
      <p className="text-muted-foreground mb-8">Upload a photo to instantly get a nutritional breakdown.</p>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} className="text-primary" />
            Upload Photo
          </h2>
          
          <div 
            className="border-2 border-dashed border-[var(--border)] rounded-xl h-64 flex flex-col items-center justify-center bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer overflow-hidden relative"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageSelect}
            />
            
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                <Upload size={32} className="text-muted-foreground mb-3" />
                <p className="font-medium">Click to select an image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, HEIC up to 10MB</p>
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}
          
          <div className="mt-6 flex gap-3">
            <Button 
              className="w-full" 
              disabled={!imageFile || isAnalyzing}
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing with AI..." : "Analyze Image"}
            </Button>
            {imageFile && !isAnalyzing && (
              <Button variant="outline" onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                setResult(null);
              }}>
                Clear
              </Button>
            )}
          </div>
        </Card>
        
        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {result ? (
            <>
              <Card className="p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10" />
                <h2 className="text-2xl font-bold mb-1 pr-12">{result.name}</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-primary mb-6">
                  <CheckCircle2 size={16} />
                  Analysis Complete
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-secondary/50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold">{result.calories}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Calories</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-500">{result.protein}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Protein</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-500">{result.carbs}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Carbs</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-red-400">{result.fat}g</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Fat</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity size={16} className="text-primary" />
                      Health Score
                    </h3>
                    <span className="text-xl font-bold">{result.healthScore}/100</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        result.healthScore > 75 ? "bg-green-500" : result.healthScore > 40 ? "bg-amber-500" : "bg-red-500"
                      }`} 
                      style={{ width: `${result.healthScore}%` }}
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-accent" />
                  AI Insights
                </h3>
                <p className="text-foreground/90 leading-relaxed text-sm">
                  {result.insights}
                </p>
                
                <h3 className="font-semibold mt-6 mb-3 text-sm">Detected Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {result.ingredients.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed border-2">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
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
