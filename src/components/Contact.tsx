import { useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';

interface Props { t: Translations; lang: Lang; }

export default function Contact({ t, lang }: Props) {
  const cf = t.contactForm;
  const [form, setForm] = useState({ name: '', email: '', project: cf.types[0], message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${form.project}] ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:altitudemusic13@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
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
                <div><label>{cf.name}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label>{cf.email}</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div>
                <label>{cf.project}</label>
                <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
                  {cf.types.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div><label>{cf.message}</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" type="submit">{cf.send}</button>
                <a className="btn ghost" href="https://wa.me/32400000000" target="_blank" rel="noopener">{cf.whatsapp}</a>
              </div>
              {sent && <div className="form-success">✓ {cf.sent}</div>}
            </form>
          </div>
          <div className="map-wrap">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.6075%2C50.6675%2C4.6225%2C50.6735&layer=mapnik&marker=50.6705%2C4.6150"
              loading="lazy"
              title="Altitude Music Studio location"
            />
          </div>
        </div>
  );
}
