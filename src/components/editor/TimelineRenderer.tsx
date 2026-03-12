"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// @ts-ignore - TL is from the external script
declare const TL: any;

interface TimelineProps {
  events: any[];
  titleSlide?: any;
  appearance?: any;
}

export default function TimelineRenderer({ events, titleSlide, appearance }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const timelineInstance = useRef<any>(null);

  // Re-build timeline when events change or script loads
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !events || events.length === 0) return;

    // Filter out completely empty events to prevent TL errors
    // An event needs at least a start year or a headline
    const validEvents = events.filter(e => 
      (e.start_date?.year && e.start_date.year !== "") || 
      (e.text?.headline && e.text.headline !== "")
    );

    if (validEvents.length === 0) return;

    // Start building timelineData
    const timelineData: any = {
      events: JSON.parse(JSON.stringify(validEvents))
    };
    
    // Inject custom Title Slide if provided
    if (titleSlide?.text?.headline) {
      timelineData.title = {
        text: titleSlide.text,
        media: titleSlide.media,
        background: titleSlide.background
      };
    } else {
      // Fallback
      timelineData.title = {
        text: {
          headline: "Zaman Tüneli",
          text: ""
        }
      };
    }

    const options: any = {
      language: "tr",
      hash_bookmark: false,
      initial_zoom: 2,
      debug: false
    };

    if (appearance?.font && appearance.font !== 'default') {
      options.font = appearance.font;
    }

    try {
      // Clean up previous instance conceptually (TimelineJS doesn't have a clean destroy method)
      if (containerRef.current) {
         containerRef.current.innerHTML = "";
      }
      
      // Instantiate
      timelineInstance.current = new TL.Timeline(containerRef.current, timelineData, options);
    } catch (e) {
      console.error("Timeline oluşturulurken hata:", e);
    }
    
  }, [events, isScriptLoaded]);

  return (
    <>
      {/* Load core CSS */}
      <link 
        title="timeline-styles" 
        rel="stylesheet" 
        href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css" 
      />

      {/* Load core JS */}
      <Script 
        src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js" 
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      {/* Container where TL.Timeline will inject the SVG & UI */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: "100%" }}
      />
    </>
  );
}
