import TimelineRenderer from "@/components/editor/TimelineRenderer";
import { notFound } from "next/navigation";

// Sunucu tarafında (Server Component) Supabase verisini çekeceğiz.
export default async function EmbedPage({ params }: { params: { id: string } }) {
  const { id } = params;

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
  
  // To avoid changing TimelineRenderer too much right now, we can pass events.
  // Although TimelineRenderer expects just `events` and builds the `title` internally, 
  // Let's modify it slightly or just pass the events back down to the renderer.
  // For now, we will just inject the events.
  
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-background">
      <TimelineRenderer events={timelineData.events} />
    </div>
  );
}
