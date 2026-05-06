"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/core";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative py-20 md:py-32 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles size={16} />
          <span>Powered by Gemini Vision AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Understand Your Food.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Optimize Your Health.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Simply snap a photo of your meal, and let our AI provide a detailed nutritional breakdown and personalized health insights in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          <Link href="/analyze">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8">
              <Camera size={20} />
              Analyze a Meal
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How NutriMind AI Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to transform how you eat and track your nutrition.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Camera size={100} />
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Snap a Photo</h3>
            <p className="text-muted-foreground">Take a picture of your meal before you eat. No need to manually log every ingredient or weigh your food.</p>
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={100} />
            </div>
            <div className="h-12 w-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
            <p className="text-muted-foreground">Our advanced Gemini Vision AI instantly identifies the food, estimates portion sizes, and calculates macros.</p>
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={100} />
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Get Insights</h3>
            <p className="text-muted-foreground">Receive a personalized health score and actionable insights to help you make better nutritional choices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
