import Link from "next/link";
import { ArrowRight, Clock, Globe, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Clock className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Zaman<span className="text-primary"> Tüneli</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#features">Özellikler</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-48 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Hikayenizi <span className="text-primary block mt-2">Zamana Yayın</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                  Gazeteciler, araştırmacılar ve içerik üreticileri için ücretsiz, interaktif ve tamamen Türkçe kronoloji oluşturma aracı.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                <Link
                  href="/editor"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Örnekleri İncele
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 lg:py-32 bg-background flex items-center justify-center border-t border-border/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hızlı ve Kolay</h3>
                <p className="text-muted-foreground leading-relaxed">Etkinlikleri ekleyin, medyalarınızı bağlayın ve tek tıkla kronolojinizi oluşturun. Kod bilmek gerekmez.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Her Yerde Paylaşın</h3>
                <p className="text-muted-foreground leading-relaxed">Oluşturduğunuz embed kodunu haber sitenize, blogunuza veya istediğiniz platforma saniyeler içinde gömün.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Modern Görünüm</h3>
                <p className="text-muted-foreground leading-relaxed">TimelineJS3 altyapısıyla desteklenen pürüzsüz animasyonlar ve cihaz uyumlu harika arayüzler.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-muted/20 py-8 flex items-center justify-center">
        <div className="container px-4 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            <span>Zaman Tüneli</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Tüm hakları saklıdır. Açık kaynak teknolojilerle geliştirilmiştir.</p>
        </div>
      </footer>
    </div>
  );
}
