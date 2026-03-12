import TimelineRenderer from "@/components/editor/TimelineRenderer";
import { notFound } from "next/navigation";

// Sunucu tarafında (Server Component) Supabase verisini çekeceğiz.
export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Internal API call to our own route (which uses Supabase)
  // Note: we can't easily fetch absolute local URLs in a server component during build time without knowing the host.
  // Instead, we will fetch directly using our supabase client.
  
  const { supabase } = await import('@/lib/supabase');
  
  const { data, error } = await supabase
    .from('timelines')
    .select('data')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Embed load error:", error);
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-xl font-bold">Timeline Bulunamadı</h1>
        <p className="text-muted-foreground mt-2">Bu içerik silinmiş veya adresi yanlış olabilir.</p>
      </div>
    );
  }

  // data.data contains the { title: {}, events: [] } object
  const timelineData = data.data;
  
  // Güvenlik: Eğer 'events' dizisi yoksa veya eski corrupted veri ise, boş gönder.
  const safeEvents = Array.isArray(timelineData?.events) ? timelineData.events : [];
  const titleSlideData = timelineData?.title || null;
  const appearanceData = timelineData?.appearance || null;
  
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-background">
      <TimelineRenderer 
        events={safeEvents} 
        titleSlide={titleSlideData}
        appearance={appearanceData}
      />
    </div>
  );
}
