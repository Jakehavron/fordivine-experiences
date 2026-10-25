"use client";

import { useState } from "react";

export default function EpisodeEmbed({ embedUrl, title }: { embedUrl: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <iframe
      src={`${embedUrl}&autoplay=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />;
  }

  return <button
    className="episode-module__play"
    type="button"
    onClick={() => setPlaying(true)}
    aria-label={`Play ${title}`}
    data-embed-url={embedUrl}
  >
    <span className="episode-module__play-icon" aria-hidden="true" />
    <span>Play episode</span>
  </button>;
}
