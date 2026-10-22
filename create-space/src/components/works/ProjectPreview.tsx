import { useState } from "react";
import { buildScreenshotSources } from "@/lib/works/constants";

const MAX_MSHOTS_RETRIES = 4;
const MSHOTS_PLACEHOLDER_WIDTH = 400;

type ProjectPreviewProps = {
  url: string;
  title: string;
  gradient: string;
};

export function ProjectPreview({ url, title, gradient }: ProjectPreviewProps) {
  const sources = buildScreenshotSources(url);
  const [srcIndex, setSrcIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [cacheBust, setCacheBust] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const initials = title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isMshots = sources[srcIndex].includes("mshots");
  const currentSrc = isMshots && cacheBust > 0 ? `${sources[srcIndex]}&retry=${cacheBust}` : sources[srcIndex];

  const advanceProvider = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
      setRetryCount(0);
      setCacheBust(0);
    } else {
      setFailed(true);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block aspect-[16/10] overflow-hidden bg-gradient-to-br ${gradient}`}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 to-muted/10" />
      )}

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-white/90 drop-shadow-lg tracking-tight">{initials}</span>
        </div>
      )}

      {!failed && (
        <img
          key={`${srcIndex}-${cacheBust}`}
          src={currentSrc}
          alt={`${title} live preview`}
          loading="lazy"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (isMshots && img.naturalWidth > 0 && img.naturalWidth <= MSHOTS_PLACEHOLDER_WIDTH + 20) {
              if (retryCount < MAX_MSHOTS_RETRIES) {
                const next = retryCount + 1;
                setTimeout(() => {
                  setRetryCount(next);
                  setCacheBust(next);
                }, 2500);
                return;
              }
              advanceProvider();
              return;
            }
            setLoaded(true);
          }}
          onError={advanceProvider}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-[1.03] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none" />
    </a>
  );
}
