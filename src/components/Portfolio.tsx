import { useState, useMemo, useRef, useEffect } from 'react';
import type { Translations, Lang } from '../i18n/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  genre: string;
  year: string;
  color: string;
  sortOrder: number;
  spotifyUrl?: string;
  spotifyTrackId?: string;
  audioSrc: string;
  previewDuration: number;
}

interface Props {
  tracks: Track[];
  t: Translations;
  lang: Lang;
  layout?: 'list' | 'grid';
}

const PLAYLIST_URL = 'https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE';

function CoverArt({ track }: { track: Track }) {
  const c2 = `color-mix(in srgb, ${track.color} 50%, #000)`;
  return (
    <div className="cover-art" style={{ '--c1': track.color, '--c2': c2 } as React.CSSProperties}>
      <span>{track.title.toUpperCase()}</span>
    </div>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Portfolio({ tracks, t, layout = 'list' }: Props) {
  const tp = t.portfolio;
  const sorted = useMemo(() => [...tracks].sort((a, b) => a.sortOrder - b.sortOrder), [tracks]);
  const genres = useMemo(() => ['All', ...Array.from(new Set(sorted.map(tr => tr.genre)))], [sorted]);
  const [filter, setFilter] = useState('All');
  const [playing, setPlaying] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const filtered = filter === 'All' ? sorted : sorted.filter(tr => tr.genre === filter);
  const current = sorted.find(tr => tr.id === playing) ?? null;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnded = () => { setPlaying(null); setTime(0); };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!current?.audioSrc) { a.pause(); return; }
    a.src = current.audioSrc;
    a.play().catch(() => setPlaying(null));
  }, [playing, current?.audioSrc]);

  const togglePlay = (tr: Track) => {
    if (!tr.audioSrc) {
      window.open(tr.spotifyUrl ?? PLAYLIST_URL, '_blank', 'noopener');
      return;
    }
    setPlaying(prev => (prev === tr.id ? null : tr.id));
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
  };

  return (
    <>
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />

      <div className="port-controls">
        <span style={{ alignSelf: 'center', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 8 }}>
          {tp.filter} ▸
        </span>
        {genres.map(g => (
          <button key={g} className={filter === g ? 'active' : ''} onClick={() => setFilter(g)}>
            {g === 'All' ? tp.all : g}
          </button>
        ))}
      </div>

      {layout === 'grid' ? (
        <div className="port-grid">
          {filtered.map(tr => (
            <div key={tr.id} className="port-tile" onClick={() => togglePlay(tr)}>
              <div className="cover-big"><CoverArt track={tr} /></div>
              <div className="body">
                <span className="title">{tr.title}</span>
                <span className="artist">{tr.artist} · {tr.genre}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="port-list">
          <div className="port-row head">
            <span>#</span><span></span><span>TITLE</span>
            <span className="col-hide">ARTIST</span>
            <span className="col-hide">{tp.genre}</span>
            <span className="col-hide">{tp.bpm}</span>
            <span className="col-hide">{tp.duration}</span>
            <span></span>
          </div>
          {filtered.map((tr) => {
            const isPlaying = playing === tr.id;
            return (
              <div key={tr.id} className={`port-row ${isPlaying ? 'playing' : ''}`}>
                <button className="play-btn" onClick={() => togglePlay(tr)} aria-label={isPlaying ? tp.pause : tp.play}>
                  {isPlaying ? <span className="wave-now"><span /><span /><span /></span> : '▶'}
                </button>
                <div className="cover"><CoverArt track={tr} /></div>
                <div>
                  <div className="title">{tr.title}</div>
                  <div className="artist">{tr.year} · {tr.genre}</div>
                </div>
                <span className="artist col-hide">{tr.artist}</span>
                <span className="meta col-hide">{tr.genre}</span>
                <span className="meta col-hide">{tr.bpm}</span>
                <span className="meta col-hide">{tr.duration}</span>
                <a href={tr.spotifyUrl ?? PLAYLIST_URL} target="_blank" rel="noopener" className="open-link" title={tp.open}>↗</a>
              </div>
            );
          })}
        </div>
      )}

      {current && (
        <div className="now-bar">
          <div className="cover" style={{ width: 40, height: 40, position: 'relative', borderRadius: 4, overflow: 'hidden', flex: '0 0 40px' }}>
            <CoverArt track={current} />
          </div>
          <div style={{ flex: '0 0 auto', minWidth: 0, maxWidth: 200 }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {current.title}
            </div>
            <div style={{ color: 'var(--fg-3)', fontSize: 11, letterSpacing: '0.1em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {current.artist}
            </div>
          </div>
          <span className="time">{fmt(time)}</span>
          <div className="progress" onClick={onSeek} role="slider" aria-label="Seek" tabIndex={0}>
            <div style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
          </div>
          <span className="time">{fmt(duration || current.previewDuration)}</span>
          <span className="preview-tag">PREVIEW</span>
          <a href={current.spotifyUrl ?? PLAYLIST_URL} target="_blank" rel="noopener" className="spotify-link">
            FULL ↗
          </a>
          <button
            onClick={() => setPlaying(null)}
            aria-label="Close player"
            className="close-btn"
          >×</button>
        </div>
      )}
    </>
  );
}
