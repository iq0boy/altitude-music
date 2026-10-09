// Build-time opening hours from Cal.com, for the JSON-LD `openingHoursSpecification`.
// 1. With CAL_API_KEY (Netlify env var): the exact default schedule (Settings → Availability).
// 2. Without: derived from the public slots of the next 14 days (what is really bookable).
// 3. On any failure: the coded fallback. Runs once per build (module-level cache).
export interface OpeningHoursSpec { '@type': 'OpeningHoursSpecification'; dayOfWeek: string[]; opens: string; closes: string }

const API = 'https://api.cal.com/v2';
const TZ = 'Europe/Brussels';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HEADERS = { 'User-Agent': 'altitudemusic.be (build)' };

export const FALLBACK_HOURS: OpeningHoursSpec[] = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS.slice(0, 6), opens: '13:00', closes: '23:59' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });
const weekday = (iso: string) => new Date(iso).toLocaleDateString('en-US', { weekday: 'long', timeZone: TZ });

async function getJson(url: string, headers: Record<string, string>) {
  const res = await fetch(url, { headers: { ...HEADERS, ...headers }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

// Merge weekdays sharing the same opens/closes into one spec, in weekday order.
function groupDays(byDay: Map<string, { opens: string; closes: string }>): OpeningHoursSpec[] {
  const groups = new Map<string, OpeningHoursSpec>();
  for (const day of DAYS) {
    const h = byDay.get(day); if (!h) continue;
    const key = `${h.opens}-${h.closes}`;
    const g = groups.get(key) ?? { '@type': 'OpeningHoursSpecification', dayOfWeek: [], opens: h.opens, closes: h.closes };
    g.dayOfWeek.push(day); groups.set(key, g);
  }
  return [...groups.values()];
}

async function fromSchedule(apiKey: string): Promise<OpeningHoursSpec[]> {
  const j = await getJson(`${API}/schedules/default`, { 'cal-api-version': '2024-06-11', Authorization: `Bearer ${apiKey}` });
  const byDay = new Map<string, { opens: string; closes: string }>();
  for (const a of j?.data?.availability ?? []) for (const d of a.days ?? []) byDay.set(d, { opens: a.startTime, closes: a.endTime });
  if (byDay.size === 0) throw new Error('empty schedule');
  return groupDays(byDay);
}

async function fromSlots(username: string, eventSlug: string): Promise<OpeningHoursSpec[]> {
  const start = new Date(); const end = new Date(start); end.setDate(end.getDate() + 14);
  const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const q = new URLSearchParams({ username, eventTypeSlug: eventSlug, start: ymd(start), end: ymd(end), timeZone: TZ });
  const [slots, types] = await Promise.all([
    getJson(`${API}/slots?${q}`, { 'cal-api-version': '2024-09-04' }),
    getJson(`${API}/event-types?username=${encodeURIComponent(username)}&eventSlug=${encodeURIComponent(eventSlug)}`, { 'cal-api-version': '2024-06-14' }).catch(() => null),
  ]);
  const t = types?.data; const length = (Array.isArray(t) ? t[0] : t)?.lengthInMinutes ?? 120;
  const byDay = new Map<string, { opens: string; closes: string }>();
  for (const list of Object.values<{ start: string }[]>(slots?.data ?? {})) {
    for (const { start: iso } of list) {
      const day = weekday(iso); const s = new Date(iso); const e = new Date(s.getTime() + length * 60000);
      const cur = byDay.get(day) ?? { opens: '99:99', closes: '00:00' };
      byDay.set(day, { opens: hhmm(s) < cur.opens ? hhmm(s) : cur.opens, closes: hhmm(e) > cur.closes ? hhmm(e) : cur.closes });
    }
  }
  if (byDay.size === 0) throw new Error('no slots');
  return groupDays(byDay);
}

let cached: Promise<OpeningHoursSpec[]> | null = null;
export function getOpeningHours(username?: string, eventSlug?: string): Promise<OpeningHoursSpec[]> {
  if (cached) return cached;
  const apiKey = import.meta.env.CAL_API_KEY as string | undefined;
  cached = (async () => {
    try {
      if (apiKey) { const h = await fromSchedule(apiKey); console.log('[cal] opening hours from schedule:', JSON.stringify(h)); return h; }
      if (username && eventSlug) { const h = await fromSlots(username, eventSlug); console.log('[cal] opening hours from slots:', JSON.stringify(h)); return h; }
      throw new Error('no Cal.com config');
    } catch (err) {
      console.warn('[cal] opening hours fallback:', (err as Error).message);
      return FALLBACK_HOURS;
    }
  })();
  return cached;
}
