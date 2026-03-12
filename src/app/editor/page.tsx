"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import TimelineRenderer from "@/components/editor/TimelineRenderer";

import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  background?: {
    color?: string;
    url?: string;
  };
};

// Global Appearance Settings
type AppearanceSettings = {
  font: string; // e.g., 'default', 'playfair-fauna', 'pt'
  theme: string; // optional for future use
};

// Title Slide Data (TimelineJS native title implementation)
type TitleSlide = {
  text: {
    headline: string;
    text: string;
  };
  media?: {
    url: string;
    caption?: string;
    credit?: string;
  };
  background?: {
    color?: string;
    url?: string;
  };
};

export default function EditorPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const supabase = createClient();

  const [projectTitle, setProjectTitle] = useState("Yeni Timeline Projesi");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmbedModial, setShowEmbedModal] = useState(false);
  const [isLoadingEditor, setIsLoadingEditor] = useState(!!editId);

  // New State: Title Slide (Cover)
  const [titleSlide, setTitleSlide] = useState<TitleSlide>({
    text: { headline: "Yeni Timeline Projesi", text: "Projenizin açıklama metnini buraya yazın." }
  });

  // New State: Global Appearance
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    font: "default",
    theme: "default"
  });

  // Editor mode: "title" vs "event"
  const [editorMode, setEditorMode] = useState<"title" | "event">("title");

  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      start_date: { year: new Date().getFullYear().toString(), month: (new Date().getMonth() + 1).toString(), day: new Date().getDate().toString() },
      text: { headline: "İlk Olay", text: "Bu, kronolojinizdeki ilk olaydır. Burayı düzenleyerek başlayın." }
    }
  ]);
  
  const [activeEventId, setActiveEventId] = useState<string>("1");
  const [activeEvent, setActiveEvent] = useState<TimelineEvent>(events[0]);

  // Derived state to keep `activeEvent` synced when `events` or `activeEventId` changes
  useEffect(() => {
    const found = events.find(e => e.id === activeEventId);
    if (found) setActiveEvent(found);
  }, [events, activeEventId]);

  // Load existing data if editId is provided
  useEffect(() => {
    async function loadData() {
      if (!editId) return;
      try {
        const { data, error } = await supabase
          .from('timelines')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;
        if (data) {
          setProjectTitle(data.title || "İsimsiz Proje");
          setSavedId(data.id);
          
          if (data.data) {
            const tlData = data.data;
            if (tlData.events && Array.isArray(tlData.events)) {
              setEvents(tlData.events);
              if (tlData.events.length > 0) setActiveEventId(tlData.events[0].id);
            }
            if (tlData.title) setTitleSlide(tlData.title);
            if (tlData.appearance) setAppearance(tlData.appearance);
          }
        }
      } catch (err) {
        console.error("Projeyi yüklerken hata:", err);
        alert("Proje yüklenemedi. Silinmiş olabilir veya yetkiniz yok.");
      } finally {
        setIsLoadingEditor(false);
      }
    }
    
    loadData();
  }, [editId, supabase]);

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

  const updateBackground = (field: 'color' | 'url', value: string) => {
    const currentBg = activeEvent.background || { color: '', url: '' };
    updateActiveEvent({ background: { ...currentBg, [field]: value } });
  };

  const updateTitleSlide = (category: 'text' | 'media' | 'background', field: string, value: string) => {
    setTitleSlide(prev => {
      const currentCategory = prev[category] || {};
      return {
        ...prev,
        [category]: { ...currentCategory, [field]: value }
      };
    });
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
          events: validEvents,
          titleSlide: titleSlide,
          appearance: appearance,
          isPublish: isPublish
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

  if (isLoadingEditor) {
    return <div className="w-full h-full flex items-center justify-center bg-background"><span className="animate-pulse">Proje Yükleniyor...</span></div>;
  }

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
        <div className="p-4 border-b border-border flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">İçerik</h2>
            <button 
              onClick={addEvent}
              className="p-1 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Yeni Olay Ekle"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div 
            onClick={() => setEditorMode("title")}
            className={`p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm font-medium ${
              editorMode === "title" 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background hover:bg-muted text-foreground border border-border'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Kapak (Title Slide)
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {events.map((ev, idx) => (
            <div 
              key={ev.id}
              onClick={() => {
                setActiveEventId(ev.id);
                setEditorMode("event");
              }}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors group ${
                editorMode === "event" && activeEventId === ev.id 
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
          
          {editorMode === "event" && (
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
          )}

          {/* Text Section (Dynamic based on selected mode) */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-px bg-border inline-block"></span>
              {editorMode === "title" ? "Kapak İçeriği" : "İçerik"}
              <span className="flex-1 h-px bg-border inline-block"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Ana Başlık</label>
                <input 
                  type="text" 
                  value={editorMode === "title" ? (titleSlide.text?.headline || '') : (activeEvent.text?.headline || '')}
                  onChange={(e) => editorMode === "title" ? updateTitleSlide('text', 'headline', e.target.value) : updateText('headline', e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border border-border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Başlık girin..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Açıklama (HTML destekli)</label>
                <textarea 
                  value={editorMode === "title" ? (titleSlide.text?.text || '') : (activeEvent.text?.text || '')}
                  onChange={(e) => editorMode === "title" ? updateTitleSlide('text', 'text', e.target.value) : updateText('text', e.target.value)}
                  className="w-full p-3 bg-muted/50 border border-border rounded-md text-sm min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Detaylandırın..."
                />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="space-y-4">
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
                  value={editorMode === "title" ? (titleSlide.media?.url || '') : (activeEvent.media?.url || '')}
                  onChange={(e) => editorMode === "title" ? updateTitleSlide('media', 'url', e.target.value) : updateMedia('url', e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground pl-1">Medya Altyazısı</label>
                  <input 
                    type="text" 
                    value={editorMode === "title" ? (titleSlide.media?.caption || '') : (activeEvent.media?.caption || '')}
                    onChange={(e) => editorMode === "title" ? updateTitleSlide('media', 'caption', e.target.value) : updateMedia('caption', e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Fotoğraf altı metni..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground pl-1">Kaynak / Kredi</label>
                  <input 
                    type="text" 
                    value={editorMode === "title" ? (titleSlide.media?.credit || '') : (activeEvent.media?.credit || '')}
                    onChange={(e) => editorMode === "title" ? updateTitleSlide('media', 'credit', e.target.value) : updateMedia('credit', e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Fotoğraf: Ajans adı..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Background Section */}
          <section className="space-y-4 pb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-px bg-border inline-block"></span>
              Olay Arkaplanı Görünümü
              <span className="flex-1 h-px bg-border inline-block"></span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Arkaplan Rengi (Örn: #ff0000, red)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={editorMode === "title" 
                      ? (titleSlide.background?.color?.match(/^#[0-9a-f]{6}$/i) ? titleSlide.background.color : '#ffffff') 
                      : (activeEvent.background?.color?.match(/^#[0-9a-f]{6}$/i) ? activeEvent.background.color : '#ffffff')
                    }
                    onChange={(e) => editorMode === "title" ? updateTitleSlide('background', 'color', e.target.value) : updateBackground('color', e.target.value)}
                    className="h-10 w-10 p-1 bg-background border border-border rounded-md cursor-pointer shrink-0"
                  />
                  <input 
                    type="text" 
                    value={editorMode === "title" ? (titleSlide.background?.color || '') : (activeEvent.background?.color || '')}
                    onChange={(e) => editorMode === "title" ? updateTitleSlide('background', 'color', e.target.value) : updateBackground('color', e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                    placeholder="#1e293b"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">Veya Arkaplan Görseli URL'si</label>
                <input 
                  type="url" 
                  value={editorMode === "title" ? (titleSlide.background?.url || '') : (activeEvent.background?.url || '')}
                  onChange={(e) => editorMode === "title" ? updateTitleSlide('background', 'url', e.target.value) : updateBackground('url', e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
            {/* Not: Opacity / Overlay efekti için CSS inject etme yöntemini TimelineRenderer'da değerlendireceğiz */}
          </section>

        </div>
      </div>

      {/* RIGHT PANEL: Live Preview Area */}
      <div className="flex-1 bg-muted/20 relative flex flex-col max-h-full overflow-hidden">
        {/* Global Settings Toolbar */}
        <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur border border-border rounded-lg shadow-sm p-2 flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground">Yazı Tipi:</label>
          <select 
            value={appearance.font}
            onChange={(e) => setAppearance({ ...appearance, font: e.target.value })}
            className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
          >
            <option value="default">Varsayılan (Helvetica)</option>
            <option value="playfair-fauna">Playfair & Fauna One</option>
            <option value="lato-merriweather">Lato & Merriweather</option>
            <option value="abril-droidsans">Abril Fatface & Droid</option>
            <option value="georgia-helvetica">Georgia & Helvetica</option>
            <option value="pt">PT Sans & PT Serif</option>
          </select>
        </div>

        <TimelineRenderer events={events} titleSlide={titleSlide} appearance={appearance} />
      </div>

    </div>
  );
}
