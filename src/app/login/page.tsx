"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<"github" | "google" | null>(null);
  const supabase = createClient();

  const handleLogin = async (provider: "github" | "google") => {
    setIsLoading(provider);
    
    // In production this will be the Vercel URL
    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in env
        window.location.origin; // Automatically fallback to origin
        
      // Make sure to include `https://` when not localhost.
      url = url.includes('http') ? url : `https://${url}`;
      // Make sure to including trailing `/`.
      url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
      return url;
    };

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${getURL()}auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      alert("Giriş yaparken bir hata oluştu: " + error.message);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <Clock className="w-5 h-5" />
        <span className="font-semibold tracking-tight">Zaman Tüneli</span>
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Tekrar Hoş Geldiniz</h1>
          <p className="text-muted-foreground mt-2">
            Haberlerinizi, araştırmalarınızı ve projelerinizi yönetmek için giriş yapın.
          </p>
        </div>

        <div className="bg-muted/30 border border-border p-8 rounded-2xl shadow-xl space-y-4">
          
          <button
            onClick={() => handleLogin('google')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 bg-background border border-border hover:bg-muted text-foreground py-3 px-4 rounded-xl font-medium transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoading === 'google' ? (
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            Google ile Giriş Yap
          </button>

          <button
            onClick={() => handleLogin('github')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoading === 'github' ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            GitHub ile Giriş Yap
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-muted/90 px-2 text-muted-foreground font-medium">BİLGİ</span>
            </div>
          </div>

          <p className="text-xs text-center leading-relaxed text-muted-foreground">
            Giriş yaparak platformun sağladığı içerik yönetim paneline erişebilir, hazırladığınız kronolojileri dilediğiniz zaman güncelleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
