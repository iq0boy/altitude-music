import { useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';

interface Video { id: string; title: { fr: string; en: string; nl: string }; type: string; }

interface Props { videos: Video[]; t: Translations; lang: Lang; }

export default function Videos({ videos, t, lang }: Props) {
  const [active, setActive] = useState(0);
  const main = videos[active];

  return (
    <section className="section" id="videos" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-tag reveal">// 04</div>
            <h2 className="section-title reveal">{t.sections.videos}</h2>
          </div>
          <div className="section-sub reveal">{t.sections.videosSub}</div>
        </div>
        <div className="video-grid">
          <div className="video-tile">
            <div className="embed">
              <iframe
                src={`https://www.youtube.com/embed/${main.id}?rel=0`}
                title={main.title[lang]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="body">
              <div className="vtitle">{main.title[lang]}</div>
              <span className="vtype">{main.type}</span>
            </div>
          </div>
          <div className="video-list">
            {videos.map((v, i) => i === active ? null : (
              <div key={v.id} className="video-tile" onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
                <div className="embed" style={{ aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
                  <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,91,61,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontSize: 18 }}>▶</div>
                  </div>
                </div>
                <div className="body">
                  <div className="vtitle" style={{ fontSize: 13 }}>{v.title[lang]}</div>
                  <span className="vtype">{v.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
