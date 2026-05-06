import React from "react";
import Link from "next/link";
import { Leaf, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-[var(--border)] pt-10 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 group mb-2">
              <Leaf className="text-primary h-5 w-5" />
              <span className="font-bold text-lg tracking-tight">NutriMind<span className="text-primary">AI</span></span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              AI-powered food analysis and personalized health recommendations.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              Built with <Heart size={14} className="text-red-500 fill-red-500" /> for your health
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} NutriMind AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
