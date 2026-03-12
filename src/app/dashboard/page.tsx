import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, Plus, LogOut, Settings, Trash2, Edit, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Middleware already protects this route, but we get the user to display info
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch only timelines created by this user
  const { data: timelines, error } = await supabase
    .from('timelines')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="px-6 h-16 flex items-center border-b border-border bg-background">
        <Link className="flex items-center gap-2" href="/">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-tight">Zaman Tüneli</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors">
              <LogOut className="w-4 h-4" /> Çıkış Yap
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projelerim</h1>
            <p className="text-muted-foreground mt-1">Oluşturduğunuz ve yayında olan tüm kronolojileriniz.</p>
          </div>
          <Link 
            href="/editor" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Yeni Proje
          </Link>
        </div>

        {error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
            Mevcut projeleriniz yüklenirken bir hata oluştu: {error.message}
          </div>
        ) : !timelines || timelines.length === 0 ? (
          <div className="text-center py-20 px-4 bg-muted/20 border border-dashed border-border rounded-xl">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Henüz projeniz yok</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              İlk interaktif kronolojinizi oluşturmak için sadece dakikalarınız var. Hemen başlayın.
            </p>
            <Link 
              href="/editor" 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> İlk Projeni Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {timelines.map((timeline) => (
              <div 
                key={timeline.id} 
                className="bg-muted/10 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">{timeline.title}</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Oluşturuldu: {new Date(timeline.created_at).toLocaleDateString('tr-TR')}</p>
                    <p>Son Güncelleme: {new Date(timeline.updated_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                  <Link 
                    href={`/editor?id=${timeline.id}`}
                    className="flex-1 bg-background hover:bg-muted text-foreground border border-border px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Düzenle
                  </Link>
                  <Link 
                    href={`/embed/${timeline.id}`}
                    target="_blank"
                    className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Önizle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
