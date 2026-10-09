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
