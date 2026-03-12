import Link from "next/link";
import { ArrowRight, Milestone, Globe, Zap, LayoutDashboard, Github, Linkedin, Mail, Laptop } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2 group" href="/">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Milestone className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">Zaman<span className="text-primary"> Tüneli</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="/#features">Özellikler</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="/#about">Hakkında</Link>
          {user ? (
            <Link 
              href="/dashboard"
              className="text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Panele Git
            </Link>
          ) : (
            <Link 
              href="/login"
              className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
              Giriş Yap
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 text-center">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8">
              <div className="space-y-4 max-w-4xl">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Dijital Bellek ve Görsel Hikaye Anlatıcılığı
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                  Geçmişi Bugünle <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Görselleştirin</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                  Zamanın akışını interaktif, medya zengini ve etkileyici bir deneyime dönüştürün. Gazeteciler, akademisyenler ve içerik üreticileri için tasarlandı.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                <Link
                  href="/editor"
                  className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-14 items-center justify-center rounded-xl border border-border bg-background px-10 text-base font-semibold shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Özellikleri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 lg:py-32 bg-background flex items-center justify-center border-t border-border/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-16 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-5 group">
                <div className="p-5 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Zahmetsiz Editör</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">Hücrelerde kaybolmayın. Modern arayüzümüzle etkinlikleri ekleyin, medyaları bağlayın ve anında önizleyin.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-5 group">
                <div className="p-5 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Kolay Paylaşım</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">Oluşturduğunuz projeyi tek tıkla yayınlayın ve herhangi bir web sitesine dilediğiniz gibi gömün.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-5 group">
                <div className="p-5 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Açık Kaynak Gücü</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">TimelineJS3 altyapısı ve modern web teknolojileriyle desteklenen, şeffaf ve güvenilir sistem.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-24 lg:py-32 bg-muted/20 border-t border-border/50">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">Proje Hakkında</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Zaman Tüneli, karmaşık verileri anlaşılabilir hikayelere dönüştürmek amacıyla geliştirilmiştir. 
              Knight Lab'in açık kaynaklı <strong>TimelineJS3</strong> aracı temel alınarak, Next.js ve Supabase gibi modern 
              teknolojilerle daha erişilebilir ve kullanıcı dostu bir yönetim arayüzüne kavuşturulmuştur.
            </p>
            <Link 
              href="https://github.com/sadettindemirel/zamantuneli" 
              className="flex items-center gap-2 text-primary hover:underline font-medium"
              target="_blank"
            >
              <Github className="w-5 h-5" />
              Proje Kaynak Kodlarını İncele
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-background pt-16 pb-8">
        <div className="container px-6 lg:px-14 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl">
                <Milestone className="h-6 w-6 text-primary" />
                <span>Zaman Tüneli</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Geçmişin önemli anlarını geleceğe taşımak için dijital bir bellek oluşturma platformu.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link href="/disclaimer" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                  Yasal Uyarı & Sorumluluk
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Hakkımda</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Sadettin Demirel</strong><br />
                Üsküdar Üniversitesi'nde akademisyen ve dijital içerik üreticisi.
              </p>
              <div className="flex gap-4">
                <Link href="https://github.com/sadettindemirel" target="_blank" className="text-muted-foreground hover:text-foreground">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="https://linkedin.com/in/sadettindemirel" target="_blank" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Teknolojiler</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><Link href="https://nextjs.org" target="_blank" className="hover:text-primary">Next.js 15 (App Router)</Link></li>
                <li><Link href="https://supabase.com" target="_blank" className="hover:text-primary">Supabase (Database & Auth)</Link></li>
                <li><Link href="https://timeline.knightlab.com" target="_blank" className="hover:text-primary">TimelineJS3 (Knight Lab)</Link></li>
                <li><Link href="https://tailwindcss.com" target="_blank" className="hover:text-primary">Tailwind CSS</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary">İletişim</h4>
              <p className="text-sm text-muted-foreground">
                Öneri, hata bildirimi veya iş birliği için:
              </p>
              <Link href="mailto:sadettin.demirel@uskudar.edu.tr" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                sadettin.demirel@uskudar.edu.tr
              </Link>
              <div className="pt-4 p-4 bg-muted/30 rounded-lg text-[10px] text-muted-foreground italic">
                * Güvenli iletişim için lütfen kurumsal e-posta adresinizi kullanınız.
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Zaman Tüneli. Tüm hakları saklıdır.</p>
            <p>Made with ❤️ in Istanbul</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
