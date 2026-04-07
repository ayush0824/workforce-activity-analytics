//console.log("TODO: Implement me!");



type Workplace = { id: number; name: string; status?: number };
type Shift = {
  id: number;
  workplaceId: number;
  workerId: number | null;
  cancelledAt: string | null;
  startAt: string;
  endAt: string;
};

type Paginated<T> = { data: T[]; links?: { next?: string | null } };

const BASE = process.env.API_URL ?? "http://localhost:3000";

async function fetchPage<T>(url: string): Promise<Paginated<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as Paginated<T>;
}

async function fetchAll<T>(firstPath: string): Promise<T[]> {
  let url = `${BASE}${firstPath}`;
  const out: T[] = [];
  const seen = new Set<string>(); // protect from accidental loops

  while (url && !seen.has(url)) {
    seen.add(url);
    const page = await fetchPage<T>(url);
    if (Array.isArray(page.data)) out.push(...page.data);
    const next = page.links?.next;
    url = next ?? "";
  }
  return out;
}

function isCompleted(shift: Shift, now = new Date()): boolean {
  if (shift.cancelledAt) return false;
  if (shift.workerId == null) return false;
  // Completed if the shift has ended already
  const end = new Date(shift.endAt);
  return end.getTime() <= now.getTime();
}

async function main() {
  try {
    const [workplaces, shifts] = await Promise.all([
      fetchAll<Workplace>("/workplaces"),
      fetchAll<Shift>("/shifts"),
    ]);

    // Map workplace id -> name
    const names = new Map<number, string>();
    for (const w of workplaces) names.set(w.id, w.name);

    // Count completed shifts
    const counts = new Map<number, number>();
    const now = new Date();
    for (const s of shifts) {
      if (!isCompleted(s, now)) continue;
      counts.set(s.workplaceId, (counts.get(s.workplaceId) ?? 0) + 1);
    }

    
    const rows = Array.from(names.entries()).map(([id, name]) => ({
      name,
      shifts: counts.get(id) ?? 0,
    }));

    // Sort desc by shifts, pick top 3
    const top = rows.sort((a, b) => b.shifts - a.shifts).slice(0, 3);

    
    process.stdout.write(JSON.stringify(top, null, 2));
  } catch {
   
    process.exit(1);
  }
}

main();