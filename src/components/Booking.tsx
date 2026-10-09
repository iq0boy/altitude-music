import { useEffect, useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';
import type { ServiceData } from '../data/services';

// Real booking widget wired to Cal.com's public API v2 (no key needed for public
// event types): availability from GET /slots, booking via POST /bookings.
// Needs settings.calUsername + each service's calEvent slug.
interface Props { t: Translations; lang: Lang; services: ServiceData[]; calUsername?: string; initialServiceKey?: string; }

const API = 'https://api.cal.com/v2';
const TZ = 'Europe/Brussels';
const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Booking({ t, lang, services, calUsername, initialServiceKey }: Props) {
  const tb = t.booking;
  const today = new Date();
  const bookable = services.filter(s => s.calEvent?.trim());
  const initial = bookable.find(s => s.key === initialServiceKey) ?? bookable[0];

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [serviceKey, setServiceKey] = useState<string>(initial?.key ?? '');
  const [slotsByDay, setSlotsByDay] = useState<Record<string, string[]>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [refresh, setRefresh] = useState(0);

  const service = bookable.find(s => s.key === serviceKey);
  const eventSlug = service?.calEvent?.trim();

  // Durations per event type (display only).
  useEffect(() => {
    if (!calUsername) return;
    fetch(`${API}/event-types?username=${encodeURIComponent(calUsername)}`, { headers: { 'cal-api-version': '2024-06-14' } })
      .then(r => r.json())
      .then(j => {
        const map: Record<string, number> = {};
        for (const e of j?.data ?? []) if (e.slug && e.lengthInMinutes) map[e.slug] = e.lengthInMinutes;
        setDurations(map);
      })
      .catch(() => {});
  }, [calUsername]);

  // Availability for the visible month.
  useEffect(() => {
    if (!calUsername || !eventSlug) return;
    const ctrl = new AbortController();
    const first = new Date(view.y, view.m, 1);
    const start = first < today ? today : first;
    const end = new Date(view.y, view.m + 1, 1);
    const q = new URLSearchParams({ username: calUsername, eventTypeSlug: eventSlug, start: ymd(start), end: ymd(end), timeZone: TZ });
    setLoading(true);
    fetch(`${API}/slots?${q}`, { headers: { 'cal-api-version': '2024-09-04' }, signal: ctrl.signal })
      .then(r => r.json())
      .then(j => {
        const map: Record<string, string[]> = {};
        for (const [day, list] of Object.entries<any>(j?.data ?? {})) {
          const starts = (list as { start: string }[]).map(s => s.start);
          if (starts.length) map[day] = starts;
        }
        setSlotsByDay(map);
      })
      .catch(() => { if (!ctrl.signal.aborted) setSlotsByDay({}); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, [calUsername, eventSlug, view.y, view.m, refresh]);

  if (!calUsername || !eventSlug) {
    return (
      <div className="booking-unavailable">
        <span>{tb.unavailable}</span>
        <a href={`/${lang}/#contact`} className="btn ghost">{t.nav.contact}</a>
      </div>
    );
  }

  const monthName = new Date(view.y, view.m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const dows = lang === 'fr' ? ['L','M','M','J','V','S','D'] : lang === 'nl' ? ['M','D','W','D','V','Z','Z'] : ['M','T','W','T','F','S','S'];
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  type Cell = { dim?: boolean; n: number | ''; avail?: boolean; unavail?: boolean; today?: boolean; key?: string };
  const cells: Cell[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ dim: true, n: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = ymd(new Date(view.y, view.m, d));
    const avail = !!slotsByDay[key];
    cells.push({ n: d, avail, unavail: !avail, today: key === ymd(today), key });
  }

  const navMonth = (delta: number) => {
    let m = view.m + delta, y = view.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setView({ y, m }); setPicked(null); setSlot(null);
  };
  const changeService = (key: string) => { setServiceKey(key); setPicked(null); setSlot(null); setStatus('idle'); };

  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ });
  const fmtDuration = (min?: number) => !min ? '—' : min % 60 === 0 ? `${min / 60}h` : `${min} ${tb.minutes}`;

  const daySlots = picked ? slotsByDay[picked] ?? [] : [];
  const canSubmit = !!slot && form.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && status !== 'submitting';

  const submit = async () => {
    if (!canSubmit || !slot) return;
    setStatus('submitting');
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'cal-api-version': '2024-08-13' },
        body: JSON.stringify({
          start: slot,
          eventTypeSlug: eventSlug,
          username: calUsername,
          attendee: { name: form.name.trim(), email: form.email.trim(), timeZone: TZ, language: lang },
          ...(form.notes.trim() && { bookingFieldsResponses: { notes: form.notes.trim() } }),
          metadata: { source: 'altitudemusic.be', service: serviceKey },
        }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok || j?.status !== 'success') throw new Error(j?.error?.message ?? res.statusText);
      setStatus('success');
      setSlot(null); setPicked(null);
      setRefresh(n => n + 1);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="booking-grid">
      <div className="booking-cal">
        <div className="cal-head">
          <span className="month">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
          <div className="cal-nav">
            <button onClick={() => navMonth(-1)} disabled={isCurrentMonth} aria-label="‹">‹</button>
            <button onClick={() => navMonth(1)} aria-label="›">›</button>
          </div>
        </div>
        <div className="cal-grid" aria-busy={loading}>
          {dows.map((d, i) => <div key={i} className="dow">{d}</div>)}
          {cells.map((c, i) => (
            <button key={i} disabled={!!c.dim || !!c.unavail}
              className={`cal-cell ${c.dim ? 'dim' : ''} ${c.avail ? 'avail' : ''} ${c.unavail && !c.dim ? 'unavail' : ''} ${c.today ? 'today' : ''} ${picked && c.key === picked ? 'selected' : ''}`}
              onClick={() => { if (c.avail && c.key) { setPicked(c.key); setSlot(null); setStatus('idle'); } }}>
              {c.n}
            </button>
          ))}
        </div>
        <div className="booking-note">
          {loading ? tb.loading : Object.keys(slotsByDay).length === 0 ? tb.noSlotsMonth : `⏱ ${tb.tz}`}
        </div>
      </div>

      <div className="booking-side">
        <div>
          <label>{tb.service}</label>
          <select value={serviceKey} onChange={e => changeService(e.target.value)}>
            {bookable.map(s => <option key={s.key} value={s.key}>{s.name[lang]}</option>)}
          </select>
        </div>

        <div>
          <label>{tb.pickTime}</label>
          {!picked ? (
            <div className="booking-hint">{tb.pickDate}</div>
          ) : daySlots.length === 0 ? (
            <div className="booking-hint">{tb.noSlots}</div>
          ) : (
            <div className="slots">
              {daySlots.map(s => (
                <button key={s} className={`slot${slot === s ? ' selected' : ''}`} onClick={() => { setSlot(s); setStatus('idle'); }}>{fmtTime(s)}</button>
              ))}
            </div>
          )}
        </div>

        {slot && (
          <>
            <div className="booking-summary">
              <div className="row"><span className="k">{tb.service.toUpperCase()}</span><span>{service?.name[lang]}</span></div>
              <div className="row"><span className="k">{tb.duration.toUpperCase()}</span><span>{fmtDuration(durations[eventSlug])}</span></div>
              <div className="row"><span className="k">DATE</span><span>{fmtDate(slot)}</span></div>
              <div className="row"><span className="k">{tb.time.toUpperCase()}</span><span>{fmtTime(slot)}</span></div>
            </div>
            <div className="form-row">
              <div><label>{tb.name}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" required /></div>
              <div><label>{tb.email}</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" required /></div>
            </div>
            <div><label>{tb.notes}</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
          </>
        )}

        <button className="btn accent" onClick={submit} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5 }}>
          {status === 'submitting' ? tb.submitting : tb.confirm}
        </button>
        {status === 'success' && <div className="form-success">✓ {tb.booked}</div>}
        {status === 'error' && <div className="form-error">{tb.error}</div>}
      </div>
    </div>
  );
}
