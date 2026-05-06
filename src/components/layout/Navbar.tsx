"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, LayoutDashboard, Camera } from "lucide-react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Analyze Meal", href: "/analyze", icon: <Camera size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Leaf className="text-primary h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">NutriMind<span className="text-primary">AI</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-4 border-l border-[var(--border)] pl-4">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary transition-colors">
                  <img src="https://ui-avatars.com/api/?name=Guest+User&background=10b981&color=fff" alt="Profile" />
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-foreground/80 hover:text-foreground p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-b border-[var(--border)] absolute w-full left-0 top-16 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-[var(--border)] px-3 flex flex-col gap-4">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/30">
                  <img src="https://ui-avatars.com/api/?name=Guest+User&background=10b981&color=fff" alt="Profile" />
                </div>
                <div>
                  <p className="font-medium">Guest User</p>
                  <p className="text-xs text-muted-foreground">Welcome to NutriMind</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
