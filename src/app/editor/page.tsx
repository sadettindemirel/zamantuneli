"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import TimelineRenderer from "@/components/editor/TimelineRenderer";

// Types corresponding to TimelineJS spec
type TimelineEvent = {
  id: string;
  start_date: {
    year: string;
    month?: string;
    day?: string;
  };
  end_date?: {
    year: string;
    month?: string;
    day?: string;
  };
  text: {
    headline: string;
    text: string;
  };
  media?: {
    url: string;
    caption?: string;
    credit?: string;
  };
};

export default function EditorPage() {
  const [projectTitle, setProjectTitle] = useState("Yeni Timeline Projesi");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmbedModial, setShowEmbedModal] = useState(false);

  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      start_date: { year: new Date().getFullYear().toString(), month: (new Date().getMonth() + 1).toString(), day: new Date().getDate().toString() },
      text: { headline: "İlk Olay", text: "Bu, kronolojinizdeki ilk olaydır. Burayı düzenleyerek başlayın." }
    }
  ]);
  
  const [activeEventId, setActiveEventId] = useState<string>("1");
  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  const updateActiveEvent = (updates: Partial<TimelineEvent>) => {
    setEvents(events.map(e => e.id === activeEventId ? { ...e, ...updates } : e));
  };

  const updateText = (field: 'headline' | 'text', value: string) => {
    updateActiveEvent({ text: { ...activeEvent.text, [field]: value } });
  };

  const updateMedia = (field: 'url' | 'caption' | 'credit', value: string) => {
    const currentMedia = activeEvent.media || { url: '', caption: '', credit: '' };
    updateActiveEvent({ media: { ...currentMedia, [field]: value } });
  };

  const updateStartDate = (field: 'year' | 'month' | 'day', value: string) => {
    updateActiveEvent({ start_date: { ...activeEvent.start_date, [field]: value } });
  };

  const addEvent = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setEvents([...events, {
      id: newId,
      start_date: { year: new Date().getFullYear().toString() },
      text: { headline: "Yeni Olay", text: "" }
    }]);
    setActiveEventId(newId);
  };

  const deleteEvent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (events.length === 1) return; // Don't delete last event
    
    const newEvents = events.filter(ev => ev.id !== id);
    setEvents(newEvents);
    if (activeEventId === id) {
      setActiveEventId(newEvents[0].id);
    }
  };

  const handleSave = async (isPublish = false) => {
    setIsSaving(true);
    try {
      // Filter empty events
      const validEvents = events.filter(e => 
        (e.start_date?.year && e.start_date.year !== "") || 
        (e.text?.headline && e.text.headline !== "")
      );

      const response = await fetch('/api/timelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: savedId, 
          title: projectTitle,
          events: validEvents
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (!savedId) setSavedId(data.timelineId);
        if (isPublish) {
           setShowEmbedModal(true);
        } else {
           alert("Başarıyla kaydedildi!");
        }
      } else {
        alert("Kaydetme hatası: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleSaveEvent = () => handleSave(false);
    const handlePublishEvent = () => handleSave(true);
    
    window.addEventListener('save-timeline', handleSaveEvent);
    window.addEventListener('publish-timeline', handlePublishEvent);
    
    return () => {
      window.removeEventListener('save-timeline', handleSaveEvent);
      window.removeEventListener('publish-timeline', handlePublishEvent);
    };
  }, [events, projectTitle, savedId]);

  return (
    <div className="flex w-full h-full relative">
      {/* Embed Modal Overlay */}
      {showEmbedModial && savedId && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background border border-border shadow-2xl rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-emerald-500">🎉</span> Yayında!
            </h2>
            <p className="text-muted-foreground mb-6">
              Aşağıdaki HTML <strong>iframe</strong> kodunu kopyalayıp haber sitenize veya blogunuza gömebilirsiniz. (Embed kodunuz tamamen Türkçe ve duyarlı-responsive çalışacaktır).
            </p>
            
            <div className="bg-muted p-4 rounded-lg border border-border copy-container relative group">
              <code className="text-sm font-mono break-all text-primary">
                {`<iframe src="${window.location.origin}/embed/${savedId}" width="100%" height="600" frameborder="0"></iframe>`}
              </code>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setShowEmbedModal(false)}
                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Navigator */}
      <div className="w-64 border-r border-border bg-muted/10 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Olaylarınız</h2>
          <button 
            onClick={addEvent}
            className="p-1 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Yeni Olay Ekle"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {events.map((ev, idx) => (
            <div 
              key={ev.id}
              onClick={() => setActiveEventId(ev.id)}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors group ${
                activeEventId === ev.id 
                  ? 'bg-primary/10 border border-primary/20 text-foreground' 
                  : 'hover:bg-muted text-muted-foreground border border-transparent'
              }`}
            >
              <GripVertical className="h-4 w-4 opacity-50 shrink-0" />
              <div className="flex-1 truncate text-sm font-medium">
                {ev.text.headline || "İsimsiz Olay"}
              </div>
              <button 
                onClick={(e) => deleteEvent(e, ev.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all shrink-0"
                disabled={events.length === 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE PANEL: Detailed Editor */}
      <div className="w-[450px] border-r border-border bg-background flex flex-col h-full shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <div className="p-6 border-b border-border flex-1 overflow-y-auto space-y-8">
          
          {/* Timeline Date Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-px bg-border inline-block"></span>
              Zaman
              <span className="flex-1 h-px bg-border inline-block"></span>
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Yıl</label>
                <input 
                  type="number" 
                  value={activeEvent.start_date.year || ''}
                  onChange={(e) => updateStartDate('year', e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Ör: 2024"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Ay</label>
                <input 
                  type="number" min="1" max="12"
                  value={activeEvent.start_date.month || ''}
                  onChange={(e) => updateStartDate('month', e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ör: 05"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Gün</label>
                <input 
                  type="number" min="1" max="31"
                  value={activeEvent.start_date.day || ''}
                  onChange={(e) => updateStartDate('day', e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ör: 15"
                />
              </div>
            </div>
          </section>

          {/* Text Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-px bg-border inline-block"></span>
              İçerik
              <span className="flex-1 h-px bg-border inline-block"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Başlık</label>
                <input 
                  type="text" 
                  value={activeEvent.text?.headline || ''}
                  onChange={(e) => updateText('headline', e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border border-border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Olayın başlığı..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Açıklama (HTML destekiği mevcut)</label>
                <textarea 
                  value={activeEvent.text?.text || ''}
                  onChange={(e) => updateText('text', e.target.value)}
                  className="w-full p-3 bg-muted/50 border border-border rounded-md text-sm min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Olayı detaylandırın..."
                />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="space-y-4 pb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-px bg-border inline-block"></span>
              Medya (Görsel / Video)
              <span className="flex-1 h-px bg-border inline-block"></span>
            </h3>
            
            <div className="space-y-4 p-4 rounded-xl border border-dashed border-border bg-muted/10">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Medya URL'si (YouTube, Görsel vb.)
                </label>
                <input 
                  type="url" 
                  value={activeEvent.media?.url || ''}
                  onChange={(e) => updateMedia('url', e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground pl-1">Medya Altyazısı</label>
                  <input 
                    type="text" 
                    value={activeEvent.media?.caption || ''}
                    onChange={(e) => updateMedia('caption', e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Fotoğraf altı metni..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground pl-1">Kaynak / Kredi</label>
                  <input 
                    type="text" 
                    value={activeEvent.media?.credit || ''}
                    onChange={(e) => updateMedia('credit', e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Fotoğraf: Ajans adı..."
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT PANEL: Live Preview Area */}
      <div className="flex-1 bg-muted/20 relative flex flex-col max-h-full overflow-hidden">
        <TimelineRenderer events={events} />
      </div>

    </div>
  );
}
