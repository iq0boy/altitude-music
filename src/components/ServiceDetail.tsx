import { useState, useEffect } from 'react';
import type { Translations, Lang } from '../i18n/utils';
import type { ServiceData } from '../data/services';

interface Testimonial { name: string; role: string; service: string; text: { fr: string; en: string; nl: string }; rating: number; }

interface Props {
  t: Translations;
  lang: Lang;
  services: ServiceData[];
  testimonials: Testimonial[];
}

export default function ServiceDetail({ t, lang, services, testimonials }: Props) {
  const [serviceKey, setServiceKey] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#service\/([a-z]+)/);
      if (m && services.some(s => s.key === m[1])) {
        setServiceKey(m[1]);
        window.scrollTo(0, 0);
      } else {
        setServiceKey(null);
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [services]);

  const close = () => {
    history.pushState(null, '', window.location.pathname + window.location.search);
    setServiceKey(null);
  };

  if (!serviceKey) return null;

  const svc = services.find(x => x.key === serviceKey);
  if (!svc) return null;

  const name = svc.name[lang];
  const p = svc.price;
  const colors = svc.gallery;
  const videoId = svc.video;
  const longDesc = svc.long[lang];
  const includes = svc.includes[lang];
  const reviews = testimonials.filter(r => r.service === serviceKey);
  const idx = services.findIndex(x => x.key === serviceKey);
  const sd = t.serviceDetail;

  return (
    <div className="svc-page">
      <div className="svc-page-inner">
        <button className="svc-back" onClick={close}>{sd.back}</button>

        <div className="svc-hero">
          <div className="svc-hero-img" style={{ '--c1': colors[0], '--c2': colors[1] } as React.CSSProperties}>
            <span className="label">SVC / {String(idx + 1).padStart(2, '0')} · {name.toUpperCase()}</span>
          </div>
          <div className="svc-meta">
            <span className="num">SERVICE / {String(idx + 1).padStart(2, '0')}</span>
            <h1>{name}</h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.5 }}>{svc.desc[lang]}</p>
            <div className="price-big">
              {p === 0 ? <span>{svc.unit[lang]}</span> : p === -1 ? <span>{t.servicesUI.quote}</span> : (
                <><span className="from">{t.servicesUI.from}</span>€{p}<span className="unit">{svc.unit[lang]}</span></>
              )}
            </div>
          </div>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{sd.whatYouGet}</div>
          <p className="svc-desc">{longDesc}</p>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{sd.includes}</div>
          <div className="svc-includes">{includes.map((inc, i) => <div key={i}>{inc}</div>)}</div>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{sd.gallery}</div>
          <div className="svc-gallery">
            {[colors[0], colors[1], colors[2], colors[1], colors[0], colors[2]].map((c, i) => (
              <div key={i} className="tile" style={{ '--c1': c, '--c2': `color-mix(in srgb, ${c} 50%, #000)` } as React.CSSProperties}>
                <span className="ph">PHOTO {String(i + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>

        {videoId && (
          <div className="svc-section">
            <div className="svc-section-title">{sd.video}</div>
            <div className="svc-video-embed">
              <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0`} title={name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        )}

        <div className="svc-section">
          <div className="svc-section-title">{sd.reviews} ({reviews.length})</div>
          {reviews.length === 0 ? (
            <div className="svc-reviews-empty">{sd.noReviews}</div>
          ) : (
            <div className="testi-grid">
              {reviews.map((it, i) => (
                <div key={i} className="testi-card">
                  <span className="testi-tag">{name}</span>
                  <div className="testi-rating">{'★'.repeat(it.rating)}{'☆'.repeat(5 - it.rating)}</div>
                  <p className="testi-text">"{it.text[lang] || it.text.fr}"</p>
                  <div className="testi-meta">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 600 }}>{it.name[0]}</div>
                    <div><div className="name">{it.name}</div><div className="role">{it.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="svc-cta-row">
          <span className="text">{sd.cta}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="#booking" onClick={close} className="btn accent">{sd.bookNow}</a>
            <a href="#contact" onClick={close} className="btn ghost">{t.nav.contact}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
