// components.jsx — All React components for Altitude Music site
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Helpers ─────────────────────────────────────────────────────────
function CoverArt({ track, big = false }) {
  const c1 = track.color;
  const c2 = `color-mix(in srgb, ${track.color} 50%, #000)`;
  return (
    <div className={big ? "cover-art" : "cover-art"} style={{ '--c1': c1, '--c2': c2 }}>
      <span>{track.title.toUpperCase()}</span>
    </div>
  );
}

function Meter({ count = 4 }) {
  return (
    <div className="meter">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function SectionHead({ tag, title, sub }) {
  return (
    <div className="section-head">
      <div>
        <div className="section-tag reveal">{tag}</div>
        <h2 className="section-title reveal">{title}</h2>
      </div>
      <div className="section-sub reveal">{sub}</div>
    </div>
  );
}

// Split a string into per-letter spans with staggered animation delays
function SplitText({ text, delay = 0, step = 0.03, className = "" }) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          className="split-char"
          aria-hidden="true"
          style={{ animationDelay: `${delay + i * step}s` }}
        >{c === ' ' ? '\u00A0' : c}</span>
      ))}
    </span>
  );
}

// Reveal-on-scroll: adds .in to all .reveal elements when they enter viewport
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function Marquee({ words }) {
  const repeated = [...words, ...words, ...words, ...words];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {repeated.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────
function Nav({ lang, setLang, t }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 20 L9 4 L15 20 M5 14 H13" strokeLinecap="square" strokeLinejoin="miter" />
            <circle cx="19" cy="6" r="2" fill="var(--accent)" stroke="none" />
          </svg>
          ALTITUDE.MUSIC
        </a>
        <div className="nav-links">
          <a href="#work">{t.nav.work}</a>
          <a href="#services">{t.nav.services}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#blog">{t.nav.blog}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>
        <div className="nav-right">
          <div className="lang-switch">
            {['fr', 'en', 'nl'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={lang === l ? 'active' : ''}>{l.toUpperCase()}</button>
            ))}
          </div>
          <a href="#booking" className="btn accent" style={{ display: 'inline-flex' }}>{t.nav.book}</a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero({ t, heroVariant }) {
  const videoRef = useRef(null);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const timeStr = time.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <section className="hero" id="top">
      {heroVariant !== 'minimal' && (
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay loop muted playsInline
          src="https://altitudemusic.be/wp-content/uploads/2025/08/altitude.webm#t=1"
          poster=""
        />
      )}
      <div className="hero-video-overlay" />
      <div className="hero-grain" />
      <div className="hero-inner">
        <div className="hero-tag"><span className="dot" />{t.hero.tag}</div>
        <h1 className="hero-title"><SplitText text={t.hero.title} delay={0.2} step={0.025} /></h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-cta">
          <a href="#booking" className="btn">{t.hero.cta1}</a>
          <a href="#work" className="btn ghost">{t.hero.cta2}</a>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-bottom-inner">
          <div className="hero-meters">
            <Meter count={5} />
            <span>{t.hero.live}</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>● REC</span>
            <span>{timeStr} CET</span>
            <span className="col-hide">{t.hero.meta}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────
const SERVICE_KEYS = ['rec', 'mix', 'cover', 'prod', 'coach', 'book'];

function Services({ t, prices, lang, openService }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead tag="// 02" title={t.sections.services} sub={t.sections.servicesSub} />
        <div className="services-grid">
          {SERVICE_KEYS.map((k, i) => {
            const s = t.services[k];
            const p = prices[k];
            const popular = k === 'mix';
            return (
              <div key={k} className={`service-card ${popular ? 'popular' : ''}`} data-popular={t.servicesUI.popular}>
                <div className="service-num">SVC / {String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="service-name">{s.name}</div>
                </div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-price">
                  {p === 0 ? (
                    <span className="num">{s.unit}</span>
                  ) : p === -1 ? (
                    <span className="num">{t.servicesUI.quote}</span>
                  ) : (
                    <>
                      <span className="from">{t.servicesUI.from}</span>
                      <span className="num">€{p}</span>
                      <span className="unit">{s.unit}</span>
                    </>
                  )}
                </div>
                <button onClick={() => openService(k)} className="service-cta" style={{ background: 'transparent', border: 0, color: 'var(--accent)', padding: 0, textAlign: 'left', cursor: 'pointer' }}>{t.serviceDetail?.learnMore || t.servicesUI.cta}</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Service Detail Page ─────────────────────────────────────────────
function ServiceDetail({ serviceKey, t, lang, prices, onClose }) {
  const s = t.services[serviceKey];
  const p = prices[serviceKey];
  const colors = window.ALT_DATA.SERVICE_GALLERY[serviceKey] || ['#fd5f2e','#3206b8','#ffff00'];
  const videoId = window.ALT_DATA.SERVICE_VIDEOS[serviceKey];
  const longDesc = window.ALT_DATA.SERVICE_LONG[serviceKey][lang];
  const includes = t.serviceIncludes[serviceKey] || [];
  const reviews = window.ALT_DATA.TESTIMONIALS.filter(r => r.service === serviceKey);
  const idx = SERVICE_KEYS.indexOf(serviceKey);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="svc-page">
      <div className="svc-page-inner">
        <button className="svc-back" onClick={onClose}>{t.serviceDetail.back}</button>

        <div className="svc-hero">
          <div className="svc-hero-img" style={{ '--c1': colors[0], '--c2': colors[1] }}>
            <span className="label">SVC / {String(idx + 1).padStart(2, '0')} · {s.name.toUpperCase()}</span>
          </div>
          <div className="svc-meta">
            <span className="num">SERVICE / {String(idx + 1).padStart(2, '0')}</span>
            <h1>{s.name}</h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.5 }}>{s.desc}</p>
            <div className="price-big">
              {p === 0 ? <span>{s.unit}</span> : p === -1 ? <span>{t.servicesUI.quote}</span> : (
                <>
                  <span className="from">{t.servicesUI.from}</span>
                  €{p}<span className="unit">{s.unit}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{t.serviceDetail.whatYouGet}</div>
          <p className="svc-desc">{longDesc}</p>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{t.serviceDetail.includes}</div>
          <div className="svc-includes">
            {includes.map((inc, i) => <div key={i}>{inc}</div>)}
          </div>
        </div>

        <div className="svc-section">
          <div className="svc-section-title">{t.serviceDetail.gallery}</div>
          <div className="svc-gallery">
            {[colors[0], colors[1], colors[2], colors[1], colors[0], colors[2]].map((c, i) => (
              <div key={i} className="tile" style={{ '--c1': c, '--c2': `color-mix(in srgb, ${c} 50%, #000)` }}>
                <span className="ph">PHOTO {String(i + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>

        {videoId && (
          <div className="svc-section">
            <div className="svc-section-title">{t.serviceDetail.video}</div>
            <div className="svc-video-embed">
              <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0`} title={s.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        )}

        <div className="svc-section">
          <div className="svc-section-title">{t.serviceDetail.reviews} ({reviews.length})</div>
          {reviews.length === 0 ? (
            <div className="svc-reviews-empty">{t.serviceDetail.noReviews}</div>
          ) : (
            <div className="testi-grid">
              {reviews.map((it, i) => (
                <div key={i} className="testi-card">
                  <span className="testi-tag">{s.name}</span>
                  <div className="testi-rating">{'★'.repeat(it.rating)}{'☆'.repeat(5 - it.rating)}</div>
                  <p className="testi-text">"{it.text[lang] || it.text.fr || Object.values(it.text)[0]}"</p>
                  <div className="testi-meta">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 600 }}>{it.name[0]}</div>
                    <div>
                      <div className="name">{it.name}</div>
                      <div className="role">{it.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="svc-cta-row">
          <span className="text">{t.serviceDetail.cta}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="#booking" onClick={onClose} className="btn accent">{t.serviceDetail.bookNow}</a>
            <a href="#contact" onClick={onClose} className="btn ghost">{t.nav.contact}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────
function Portfolio({ t, lang, layout }) {
  const tracks = window.ALT_DATA.TRACKS;
  const [filter, setFilter] = useState('All');
  const [playing, setPlaying] = useState(null);
  const genres = useMemo(() => ['All', ...Array.from(new Set(tracks.map(tr => tr.genre)))], [tracks]);
  const filtered = filter === 'All' ? tracks : tracks.filter(tr => tr.genre === filter);
  const current = tracks.find(tr => tr.id === playing);

  // Fake progress simulation
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const i = setInterval(() => setProgress(p => (p + 1) % 100), 300);
    return () => clearInterval(i);
  }, [playing]);

  return (
    <section className="section" id="work" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 03" title={t.sections.portfolio} sub={t.sections.portfolioSub} />
        <div className="port-controls">
          <span style={{ alignSelf: 'center', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 8 }}>
            {t.portfolio.filter} ▸
          </span>
          {genres.map(g => (
            <button key={g} className={filter === g ? 'active' : ''} onClick={() => setFilter(g)}>
              {g === 'All' ? t.portfolio.all : g}
            </button>
          ))}
        </div>

        {layout === 'grid' ? (
          <div className="port-grid">
            {filtered.map(tr => (
              <div key={tr.id} className="port-tile" onClick={() => setPlaying(playing === tr.id ? null : tr.id)}>
                <div className="cover-big"><CoverArt track={tr} big /></div>
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
              <span>#</span>
              <span></span>
              <span>TITLE</span>
              <span className="col-hide">ARTIST</span>
              <span className="col-hide">{t.portfolio.genre}</span>
              <span className="col-hide">{t.portfolio.bpm}</span>
              <span className="col-hide">{t.portfolio.duration}</span>
              <span></span>
            </div>
            {filtered.map((tr, i) => {
              const isPlaying = playing === tr.id;
              return (
                <div key={tr.id} className={`port-row ${isPlaying ? 'playing' : ''}`}>
                  <button className="play-btn" onClick={() => setPlaying(isPlaying ? null : tr.id)}>
                    {isPlaying ? <span className="wave-now"><span/><span/><span/></span> : '▶'}
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
                  <a href="https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE" target="_blank" rel="noopener" className="open-link" title={t.portfolio.open}>↗</a>
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
            <a href="https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE" target="_blank" rel="noopener" className="open-link" style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SPOTIFY ↗</a>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Videos ───────────────────────────────────────────────────────────
function Videos({ t, lang }) {
  const videos = window.ALT_DATA.VIDEOS;
  const [active, setActive] = useState(0);
  const main = videos[active];
  return (
    <section className="section" id="videos" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 04" title={t.sections.videos} sub={t.sections.videosSub} />
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

// ─── About ────────────────────────────────────────────────────────────
function About({ t, lang }) {
  const team = window.ALT_DATA.TEAM;
  return (
    <section className="section" id="about" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 05" title={t.sections.about} sub={t.sections.aboutSub} />
        <div className="about-grid">
          <div className="about-text">
            <p><strong>{t.about.story}.</strong> {t.about.storyText}</p>
            <p><strong>{t.about.team}.</strong> {t.about.teamText}</p>
            <div className="stats">
              {t.about.stats.map((s, i) => (
                <div key={i} className="stat">
                  <div className="stat-n reveal">{s.n}</div>
                  <div className="stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="team-grid">
            {team.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar" style={{ '--c': m.color }}>
                  <span className="name">{m.name}</span>
                </div>
                <span className="team-role">{m.role[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────
function Testimonials({ t, lang }) {
  const initial = window.ALT_DATA.TESTIMONIALS;
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', role: '', service: 'rec', message: '', rating: 5 });
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setItems([{ name: form.name, role: form.role, service: form.service, text: { [lang]: form.message }, rating: form.rating }, ...items]);
    setForm({ name: '', role: '', service: 'rec', message: '', rating: 5 });
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  const filtered = filter === 'all' ? items : items.filter(it => it.service === filter);

  return (
    <section className="section" id="testimonials" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 06" title={t.sections.testimonials} sub={t.sections.testimonialsSub} />
        <div className="testi-filter">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{t.testi.filterAll}</button>
          {SERVICE_KEYS.filter(k => k !== 'book').map(k => (
            <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{t.services[k].name}</button>
          ))}
        </div>
        <div className="testi-grid">
          {filtered.slice(0, 6).map((it, i) => (
            <div key={i} className="testi-card">
              {it.service && <span className="testi-tag">{t.testi.ratedFor}: {t.services[it.service]?.name}</span>}
              <div className="testi-rating">{'★'.repeat(it.rating)}{'☆'.repeat(5 - it.rating)}</div>
              <p className="testi-text">"{it.text[lang] || it.text.fr || it.text.en || Object.values(it.text)[0]}"</p>
              <div className="testi-meta">
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 600 }}>
                  {it.name[0]}
                </div>
                <div>
                  <div className="name">{it.name}</div>
                  <div className="role">{it.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form className="form" onSubmit={submit}>
          <h4>{t.testi.formTitle}</h4>
          <div className="form-row">
            <div>
              <label>{t.testi.name}</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label>{t.testi.role}</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>
          <div>
            <label>{t.testi.service}</label>
            <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
              {SERVICE_KEYS.filter(k => k !== 'book').map(k => (
                <option key={k} value={k}>{t.services[k].name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>{t.testi.message}</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
          </div>
          <div>
            <label>{t.testi.rating}</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className={n <= form.rating ? 'on' : ''} onClick={() => setForm({ ...form, rating: n })}>★</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <button type="submit" className="btn">{t.testi.submit}</button>
            {done && <div className="form-success">✓ {t.testi.thanks}</div>}
          </div>
        </form>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────
function Blog({ t }) {
  return (
    <section className="section" id="blog" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 07" title={t.sections.blog} sub={t.sections.blogSub} />
        <div className="blog-grid">
          {t.blog.posts.map((p, i) => (
            <article key={i} className="blog-card">
              <span className="tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <div className="meta">
                <span>{p.date}</span>
                <span>{p.read} {t.blog.min}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Booking ──────────────────────────────────────────────────────────
function Booking({ t, lang }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setPicked] = useState(null);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(t.booking.durations[1]);
  const [service, setService] = useState(t.services.rec.name);
  const [confirmed, setConfirmed] = useState(false);

  const monthName = new Date(view.y, view.m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const dows = lang === 'fr' ? ['L','M','M','J','V','S','D'] : lang === 'nl' ? ['M','D','W','D','V','Z','Z'] : ['M','T','W','T','F','S','S'];

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ dim: true, n: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(view.y, view.m, d);
    const dow = date.getDay();
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeekend = dow === 0;
    const avail = !isPast && !isWeekend;
    const isToday = date.toDateString() === today.toDateString();
    cells.push({ n: d, avail, unavail: !avail, today: isToday, date });
  }

  const navMonth = (delta) => {
    let m = view.m + delta, y = view.y;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setView({ y, m });
    setPicked(null);
  };

  const confirm = () => {
    if (!picked || !slot) return;
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 5000);
  };

  return (
    <section className="section" id="booking" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 08" title={t.sections.booking} sub={t.sections.bookingSub} />
        <div className="booking-grid">
          <div className="booking-cal">
            <div className="cal-head">
              <span className="month">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
              <div className="cal-nav">
                <button onClick={() => navMonth(-1)}>‹</button>
                <button onClick={() => navMonth(1)}>›</button>
              </div>
            </div>
            <div className="cal-grid">
              {dows.map((d, i) => <div key={i} className="dow">{d}</div>)}
              {cells.map((c, i) => (
                <button key={i} disabled={c.dim || c.unavail}
                  className={`cal-cell ${c.dim ? 'dim' : ''} ${c.avail ? 'avail' : ''} ${c.unavail && !c.dim ? 'unavail' : ''} ${c.today ? 'today' : ''} ${picked && c.date && picked.toDateString() === c.date.toDateString() ? 'selected' : ''}`}
                  onClick={() => c.avail && setPicked(c.date)}>
                  {c.n}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ⏱ {t.booking.tz}
            </div>
          </div>
          <div className="booking-side">
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{t.booking.service}</label>
              <select value={service} onChange={e => setService(e.target.value)} style={{ width: '100%', marginTop: 8, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--fg)', padding: '12px 14px', borderRadius: 6, fontFamily: 'inherit', fontSize: 14 }}>
                {SERVICE_KEYS.map(k => <option key={k}>{t.services[k].name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{t.booking.duration}</label>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {t.booking.durations.map(d => (
                  <button key={d} className="slot" style={{ flex: 1 }}
                    onClick={() => setDuration(d)}
                    data-active={d === duration}
                    {...(d === duration ? { className: 'slot selected' } : {})}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{t.booking.pickTime}</label>
              <div className="slots" style={{ marginTop: 8 }}>
                {t.booking.slots.map((s, i) => {
                  const taken = i === 1 || i === 4;
                  return (
                    <button key={s} className={`slot ${slot === s ? 'selected' : ''} ${taken ? 'unavail' : ''}`}
                      onClick={() => !taken && setSlot(s)} disabled={taken}>{s}</button>
                  );
                })}
              </div>
            </div>
            {(picked || slot) && (
              <div className="booking-summary">
                <div className="row"><span className="k">SERVICE</span><span>{service}</span></div>
                <div className="row"><span className="k">DURATION</span><span>{duration}</span></div>
                <div className="row"><span className="k">DATE</span><span>{picked ? picked.toLocaleDateString(lang, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></div>
                <div className="row"><span className="k">TIME</span><span>{slot || '—'}</span></div>
              </div>
            )}
            <button className="btn accent" onClick={confirm} disabled={!picked || !slot} style={{ opacity: picked && slot ? 1 : 0.5 }}>
              {t.booking.confirm}
            </button>
            {confirmed && <div className="form-success">✓ {t.booking.booked}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────
function Contact({ t, lang }) {
  const [form, setForm] = useState({ name: '', email: '', project: t.contactForm.types[0], message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${form.project}] ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:altitudemusic13@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="section" id="contact" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <SectionHead tag="// 09" title={t.sections.contact} sub={t.sections.contactSub} />
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-info-row">
              <span className="k">EMAIL</span>
              <span className="v"><a href="mailto:altitudemusic13@gmail.com">altitudemusic13@gmail.com</a></span>
            </div>
            <div className="contact-info-row">
              <span className="k">STUDIO</span>
              <span className="v">6, Rue Louis de Geer<br />1348, Ottignies–Louvain-la-Neuve</span>
            </div>
            <div className="contact-info-row">
              <span className="k">WHATSAPP</span>
              <span className="v"><a href="https://wa.me/32400000000" target="_blank" rel="noopener">+32 4 00 00 00 00</a></span>
            </div>
            <div className="contact-info-row">
              <span className="k">SOCIAL</span>
              <div className="socials">
                <a href="https://www.instagram.com/alt_itude.music/" target="_blank" rel="noopener" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                </a>
                <a href="https://www.tiktok.com/@altitudemusic13" target="_blank" rel="noopener" title="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 7.5a5.5 5.5 0 01-3.4-1.2v8.4a5.7 5.7 0 11-5.7-5.7v2.7a3 3 0 103 3V2h2.7a5.5 5.5 0 005.5 5.5v0z"/></svg>
                </a>
                <a href="https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE" target="_blank" rel="noopener" title="Spotify">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 10c3-1 7-1 10 1M7.5 13c2.5-.8 6-.5 8.5 1M8 16c2-.5 4.5-.3 6.5 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                </a>
              </div>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <div className="form-row">
                <div>
                  <label>{t.contactForm.name}</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label>{t.contactForm.email}</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label>{t.contactForm.project}</label>
                <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
                  {t.contactForm.types.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label>{t.contactForm.message}</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" type="submit">{t.contactForm.send}</button>
                <a className="btn ghost" href="https://wa.me/32400000000" target="_blank" rel="noopener">{t.contactForm.whatsapp}</a>
              </div>
              {sent && <div className="form-success">✓ {t.contactForm.sent}</div>}
            </form>
          </div>
          <div className="map-wrap">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.6075%2C50.6675%2C4.6225%2C50.6735&amp;layer=mapnik&amp;marker=50.6705%2C4.6150"
              loading="lazy"
              title="Altitude Music Studio location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Chat Widget (WhatsApp) ──────────────────────────────────────────
function ChatWidget({ t }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { who: 'in', text: { fr: 'Salut ! Bienvenue chez Altitude. Comment on peut t\'aider ?', en: 'Hey! Welcome to Altitude. How can we help?', nl: 'Hey! Welkom bij Altitude. Hoe kunnen we helpen?' } }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { who: 'out', text: { _: userMsg } }]);
    setInput('');
    setTimeout(() => {
      setMsgs(m => [...m, { who: 'in', text: { fr: 'Merci ! Pour une réponse plus rapide, ouvre WhatsApp ↓', en: 'Thanks! For a faster reply, open WhatsApp ↓', nl: 'Bedankt! Voor een sneller antwoord, open WhatsApp ↓' } }]);
    }, 800);
  };

  const lang = t.chat.title === 'Studio Altitude' ? 'fr' : t.chat.title === 'Altitude Studio' && t.chat.online === 'Online' ? 'en' : 'nl';
  const waLink = `https://wa.me/32400000000?text=${encodeURIComponent('Salut Altitude !')}`;

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div className="avatar">A</div>
            <div className="meta">
              <div className="name">{t.chat.title}</div>
              <div className="status">{t.chat.online}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 18 }}>✕</button>
          </div>
          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.who}`}>
                {m.text._ || m.text[lang] || m.text.fr}
              </div>
            ))}
          </div>
          <div className="chat-cta-bar">
            <a href={waLink} target="_blank" rel="noopener">{t.chat.whatsapp} →</a>
          </div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={t.chat.placeholder} />
            <button onClick={send}>↑</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title={t.chat.open}>
        <span className="pulse" />
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm5.2 13.7c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-1.6-.1a14 14 0 01-2.5-1c-2.5-1.3-4-3.8-4.2-4-.1-.2-1-1.3-1-2.5s.7-1.8 1-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.2.4-.4.5c-.2.1-.3.3-.1.5l1 1.5c.7 1 1.3 1.4 1.6 1.5.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.6.4 0 .2 0 .8-.2 1.2z"/></svg>
      </button>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 16 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 22, height: 22 }}>
                <path d="M3 20 L9 4 L15 20 M5 14 H13" strokeLinecap="square" />
                <circle cx="19" cy="6" r="2" fill="var(--accent)" stroke="none" />
              </svg>
              ALTITUDE.MUSIC
            </div>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5, maxWidth: 320 }}>
              {t.about.storyText.split('.')[0]}.
            </p>
          </div>
          <div>
            <h5>{t.nav.services}</h5>
            <ul>
              {SERVICE_KEYS.slice(0, 5).map(k => <li key={k}><a href="#services">{t.services[k].name}</a></li>)}
            </ul>
          </div>
          <div>
            <h5>{t.nav.contact}</h5>
            <ul>
              <li><a href="mailto:altitudemusic13@gmail.com">altitudemusic13@gmail.com</a></li>
              <li><a href="https://www.instagram.com/alt_itude.music/" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@altitudemusic13" target="_blank" rel="noopener">TikTok</a></li>
              <li><a href="https://open.spotify.com/playlist/5WLi8GndFcqKUgNoIuDeEE" target="_blank" rel="noopener">Spotify</a></li>
            </ul>
          </div>
          <div>
            <h5>STUDIO</h5>
            <ul>
              <li>6, Rue Louis de Geer</li>
              <li>1348, LLN — BE</li>
              <li><a href="#booking">{t.nav.book} →</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ALTITUDE MUSIC ASBL — {t.footer.rights}</span>
          <span>{t.footer.made} ·  N50.67 E04.61</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, Services, ServiceDetail, Portfolio, Videos, About, Testimonials, Blog, Booking, Contact, ChatWidget, Footer,
  SplitText, Marquee, useScrollReveal
});
