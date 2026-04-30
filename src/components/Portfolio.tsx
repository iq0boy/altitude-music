import { useState, useMemo } from 'react';
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

export default function Portfolio({ tracks, t, layout = 'list' }: Props) {
  const tp = t.portfolio;
  const sorted = useMemo(() => [...tracks].sort((a, b) => a.sortOrder - b.sortOrder), [tracks]);
  const genres = useMemo(() => ['All', ...Array.from(new Set(sorted.map(tr => tr.genre)))], [sorted]);
  const [filter, setFilter] = useState('All');
  const [playing, setPlaying] = useState<string | null>(null);

  const filtered = filter === 'All' ? sorted : sorted.filter(tr => tr.genre === filter);
  const current = sorted.find(tr => tr.id === playing);

  const togglePlay = (tr: Track) => {
    if (!tr.spotifyTrackId) {
      window.open(tr.spotifyUrl ?? PLAYLIST_URL, '_blank', 'noopener');
      return;
    }
    setPlaying(playing === tr.id ? null : tr.id);
  };

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

      {current?.spotifyTrackId && (
        <div className="now-bar">
          <iframe
            title={`${current.title} — ${current.artist}`}
            src={`https://open.spotify.com/embed/track/${current.spotifyTrackId}?utm_source=altitudemusic`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ flex: 1, border: 0, borderRadius: 8 }}
          />
          <button
            onClick={() => setPlaying(null)}
            aria-label="Close player"
            style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--fg-2)', borderRadius: 6, width: 32, height: 32, fontSize: 16, cursor: 'pointer' }}
          >×</button>
        </div>
      )}
    </>
  );
}
