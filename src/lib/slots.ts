/** The candidate start times nobody has booked. Compared as moments, not text: Supabase writes "+00:00" where the browser writes "Z". */
export function openSlots(candidates: string[], taken: string[]): string[] {
  const takenTimes = new Set(taken.map((t) => new Date(t).getTime()));
  return candidates.filter((c) => !takenTimes.has(new Date(c).getTime()));
}
