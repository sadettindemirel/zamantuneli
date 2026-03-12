import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 h-20 flex items-center border-b border-border">
        <Link className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" href="/">
          <ArrowLeft className="h-5 w-5" />
          <span>Geri Dön</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center py-20 px-4">
        <div className="max-w-3xl w-full space-y-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Yasal Uyarı (Disclaimer)</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p>
              <strong>Zaman Tüneli</strong>, bireysel araştırmacılar, gazeteciler ve içerik üreticileri için geliştirilmiş açık kaynaklı bir kronoloji oluşturma aracıdır.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">İçerik Sorumluluğu</h2>
              <p>
                Bu platform aracılığıyla oluşturulan, paylaşılan veya yayınlanan (embed edilen) tüm içeriklerin sorumluluğu tamamen içeriği oluşturan kullanıcıya aittir. 
                Uygulama sahibi (Sadettin Demirel), kullanıcıların oluşturduğu verileri önceden modere etme yükümlülüğüne sahip değildir.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Zararlı İçerik ve Telif Gereksinimleri</h2>
              <p>
                Kullanıcılar; yasa dışı, hakaret içeren, telif haklarını ihlal eden veya topluluk standartlarına aykırı içerikler oluşturmamayı taahhüt ederler. 
                Zaman Tüneli, herhangi bir içeriğin yasalara aykırı olduğunu tespit ederse veya hak sahiplerinden geçerli bir bildirim alırsa, ilgili içeriği haber vermeksizin silme hakkını saklı tutar.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Hizmet Garantisi</h2>
              <p>
                Bu uygulama "olduğu gibi" (as is) sunulmaktadır. Verilerin kalıcılığı, uygulamanın kesintisiz çalışması veya teknik destek konusunda ticari bir garanti verilmemektedir. 
                Açık kaynaklı yapısı gereği, kullanıcılar kendi verilerinin yedeklerini almaktan sorumludur.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
