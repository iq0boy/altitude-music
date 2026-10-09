// Parses a YouTube id out of an id or any YouTube URL (watch, youtu.be, shorts, embed).
export function youtubeId(value: string | undefined | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export function isYoutube(value: string | undefined | null): boolean {
  return !!value && /youtu\.?be/.test(value) && youtubeId(value) !== null;
}

// Shorts are vertical; everything else is assumed 16/9.
export function youtubeAspect(value: string | undefined | null): '16/9' | '9/16' {
  return value && /\/shorts\//.test(value) ? '9/16' : '16/9';
}

export function youtubeThumb(id: string, aspect: '16/9' | '9/16'): string {
  return `https://i.ytimg.com/vi/${id}/${aspect === '9/16' ? 'oardefault' : 'hqdefault'}.jpg`;
}

// Best available cover for a 16:9 video: maxresdefault (1280) → sddefault (640) → hqdefault (480).
// YouTube answers a 120x90 placeholder (~1 KB) instead of 404 for missing sizes. Probed once per id.
const probed = new Map<string, Promise<string>>();
export function youtubeBestThumb(id: string, aspect: '16/9' | '9/16'): Promise<string> {
  if (aspect === '9/16') return Promise.resolve(youtubeThumb(id, aspect));
  if (!probed.has(id)) {
    probed.set(id, (async () => {
      for (const name of ['maxresdefault', 'sddefault']) {
        try {
          const res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          if (res.ok && Number(res.headers.get('content-length') ?? 0) > 5000) return `https://i.ytimg.com/vi/${id}/${name}.jpg`;
        } catch { /* try the next size */ }
      }
      return youtubeThumb(id, aspect);
    })());
  }
  return probed.get(id)!;
}
