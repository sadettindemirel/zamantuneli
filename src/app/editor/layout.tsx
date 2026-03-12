"use client";

import Link from "next/link";
import { ArrowLeft, Save, Share2, Eye } from "lucide-react";
import { Suspense } from 'react';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <input
            type="text"
            placeholder="Proje Başlığı..."
            className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-64 md:w-96 placeholder:text-muted-foreground/50"
            defaultValue="Yeni Timeline Projesi"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Önizleme</span>
          </button>
          
          <button 
            onClick={() => {
              const event = new CustomEvent('save-timeline');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Kaydet</span>
          </button>
          
          <button 
            onClick={() => {
              const event = new CustomEvent('publish-timeline');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted transition-colors"
          >
            <Share2 className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Yayınla / Embed</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 bg-background">Yükleniyor...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
