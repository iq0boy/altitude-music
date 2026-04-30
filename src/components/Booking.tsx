import { useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';
import { SERVICE_KEYS } from '../data/services';

interface Props { t: Translations; lang: Lang; }

export default function Booking({ t, lang }: Props) {
  const tb = t.booking;
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setPicked] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(tb.durations[1]);
  const [service, setService] = useState(t.services.rec.name);
  const [confirmed, setConfirmed] = useState(false);

  const monthName = new Date(view.y, view.m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const dows = lang === 'fr' ? ['L','M','M','J','V','S','D'] : lang === 'nl' ? ['M','D','W','D','V','Z','Z'] : ['M','T','W','T','F','S','S'];

  type Cell = { dim?: boolean; n: number | ''; avail?: boolean; unavail?: boolean; today?: boolean; date?: Date };
  const cells: Cell[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ dim: true, n: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(view.y, view.m, d);
    const dow = date.getDay();
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const avail = !isPast && dow !== 0;
    cells.push({ n: d, avail, unavail: !avail, today: date.toDateString() === today.toDateString(), date });
  }

  const navMonth = (delta: number) => {
    let m = view.m + delta, y = view.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setView({ y, m }); setPicked(null);
  };

  return (
    <section className="section" id="booking" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-tag reveal">// 08</div>
            <h2 className="section-title reveal">{t.sections.booking}</h2>
          </div>
          <div className="section-sub reveal">{t.sections.bookingSub}</div>
        </div>
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
                <button key={i} disabled={!!c.dim || !!c.unavail}
                  className={`cal-cell ${c.dim ? 'dim' : ''} ${c.avail ? 'avail' : ''} ${c.unavail && !c.dim ? 'unavail' : ''} ${c.today ? 'today' : ''} ${picked && c.date && picked.toDateString() === c.date.toDateString() ? 'selected' : ''}`}
                  onClick={() => c.avail && c.date && setPicked(c.date)}>
                  {c.n}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ⏱ {tb.tz}
            </div>
          </div>
          <div className="booking-side">
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{tb.service}</label>
              <select value={service} onChange={e => setService(e.target.value)} style={{ width: '100%', marginTop: 8, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--fg)', padding: '12px 14px', borderRadius: 6, fontFamily: 'inherit', fontSize: 14 }}>
                {SERVICE_KEYS.map(k => <option key={k}>{t.services[k].name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{tb.duration}</label>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {tb.durations.map(d => (
                  <button key={d} className={`slot${d === duration ? ' selected' : ''}`} style={{ flex: 1 }} onClick={() => setDuration(d)}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{tb.pickTime}</label>
              <div className="slots" style={{ marginTop: 8 }}>
                {tb.slots.map((s, i) => {
                  const taken = i === 1 || i === 4;
                  return (
                    <button key={s} className={`slot${slot === s ? ' selected' : ''}${taken ? ' unavail' : ''}`}
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
            <button className="btn accent" onClick={() => { if (picked && slot) { setConfirmed(true); setTimeout(() => setConfirmed(false), 5000); }}} disabled={!picked || !slot} style={{ opacity: picked && slot ? 1 : 0.5 }}>
              {tb.confirm}
            </button>
            {confirmed && <div className="form-success">✓ {tb.booked}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
