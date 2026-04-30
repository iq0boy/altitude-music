import { useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';
import { SERVICE_KEYS } from '../data/services';

interface Testimonial { name: string; role: string; service: string; text: { fr: string; en: string; nl: string }; rating: number; }

interface Props { testimonials: Testimonial[]; t: Translations; lang: Lang; }

export default function Testimonials({ testimonials, t, lang }: Props) {
  const [items, setItems] = useState(testimonials);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', role: '', service: 'rec', message: '', rating: 5 });
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setItems([{ name: form.name, role: form.role, service: form.service, text: { fr: form.message, en: form.message, nl: form.message }, rating: form.rating }, ...items]);
    setForm({ name: '', role: '', service: 'rec', message: '', rating: 5 });
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  const filtered = filter === 'all' ? items : items.filter(it => it.service === filter);
  const tt = t.testi;

  return (
    <section className="section" id="testimonials" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-tag reveal">// 06</div>
            <h2 className="section-title reveal">{t.sections.testimonials}</h2>
          </div>
          <div className="section-sub reveal">{t.sections.testimonialsSub}</div>
        </div>

        <div className="testi-filter">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{tt.filterAll}</button>
          {SERVICE_KEYS.filter(k => k !== 'book').map(k => (
            <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{t.services[k].name}</button>
          ))}
        </div>

        <div className="testi-grid">
          {filtered.slice(0, 6).map((it, i) => (
            <div key={i} className="testi-card">
              {it.service && <span className="testi-tag">{tt.ratedFor}: {t.services[it.service as keyof typeof t.services]?.name}</span>}
              <div className="testi-rating">{'★'.repeat(it.rating)}{'☆'.repeat(5 - it.rating)}</div>
              <p className="testi-text">"{it.text[lang] || it.text.fr}"</p>
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
          <h4>{tt.formTitle}</h4>
          <div className="form-row">
            <div><label>{tt.name}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label>{tt.role}</label><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
          </div>
          <div>
            <label>{tt.service}</label>
            <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
              {SERVICE_KEYS.filter(k => k !== 'book').map(k => <option key={k} value={k}>{t.services[k].name}</option>)}
            </select>
          </div>
          <div><label>{tt.message}</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
          <div>
            <label>{tt.rating}</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className={n <= form.rating ? 'on' : ''} onClick={() => setForm({ ...form, rating: n })}>★</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <button type="submit" className="btn">{tt.submit}</button>
            {done && <div className="form-success">✓ {tt.thanks}</div>}
          </div>
        </form>
      </div>
    </section>
  );
}
