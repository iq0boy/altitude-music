import { useState, useEffect, useMemo } from 'react';
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
}

interface Props {
  tracks: Track[];
  t: Translations;
  lang: Lang;
  layout?: 'list' | 'grid';
}

function CoverArt({ track }: { track: Track }) {
  const c2 = `color-mix(in srgb, ${track.color} 50%, #000)`;
  return (
    <div className="cover-art" style={{ '--c1': track.color, '--c2': c2 } as React.CSSProperties}>
      <span>{track.title.toUpperCase()}</span>
    </div>
  );
}

export default function Portfolio({ tracks, t, lang, layout = 'list' }: Props) {
  const tp = t.portfolio;
  const sorted = useMemo(() => [...tracks].sort((a, b) => a.sortOrder - b.sortOrder), [tracks]);
  const genres = useMemo(() => ['All', ...Array.from(new Set(sorted.map(tr => tr.genre)))], [sorted]);
  const [filter, setFilter] = useState('All');
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const filtered = filter === 'All' ? sorted : sorted.filter(tr => tr.genre === filter);
  const current = sorted.find(tr => tr.id === playing);
  const spotify = 'https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE';

  useEffect(() => {
    if (!playing) { setProgress(0); return; }
    const i = setInterval(() => setProgress(p => (p + 1) % 100), 300);
    return () => clearInterval(i);
  }, [playing]);

  return (
    <>
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
              <div key={tr.id} className="port-tile" onClick={() => setPlaying(playing === tr.id ? null : tr.id)}>
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
                  <button className="play-btn" onClick={() => setPlaying(isPlaying ? null : tr.id)}>
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
                  <a href={tr.spotifyUrl ?? spotify} target="_blank" rel="noopener" className="open-link" title={tp.open}>↗</a>
                </div>
              );
            })}
          </div>
        )}

        {current && (
          <div className="now-bar">
            <div className="cover" style={{ width: 36, height: 36, position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
              <CoverArt track={current} />
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 500 }}>{current.title}</div>
              <div style={{ color: 'var(--fg-3)', fontSize: 11, letterSpacing: '0.1em' }}>{current.artist}</div>
            </div>
            <span className="time">0:{String(Math.floor(progress * 0.36)).padStart(2, '0')}</span>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <span className="time">{current.duration}</span>
            <a href={current.spotifyUrl ?? spotify} target="_blank" rel="noopener" style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              SPOTIFY ↗
            </a>
          </div>
        )}
    </>
  );
}
