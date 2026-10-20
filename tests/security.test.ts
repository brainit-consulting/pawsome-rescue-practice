import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : [join(dir, n)]));

/** Policies on public.bookings still in force after every migration has run, in order: name → definition. */
function bookingPolicies(): Map<string, string> {
  const policies = new Map<string, string>();
  const migrations = files("supabase/migrations").filter((f) => f.endsWith(".sql")).sort();
  for (const f of migrations) {
    const sql = readFileSync(f, "utf8");
    const statements = sql.split(";").map((s) => s.replace(/--.*$/gm, "").trim());
    for (const s of statements) {
      const created = /^create policy\s+"([^"]+)"\s+on\s+(?:public\.)?bookings\b([\s\S]*)$/i.exec(s);
      if (created) policies.set(created[1], created[2]);
      const dropped = /^drop policy\s+(?:if exists\s+)?"([^"]+)"\s+on\s+(?:public\.)?bookings\b/i.exec(s);
      if (dropped) policies.delete(dropped[1]);
    }
  }
  return policies;
}

describe("security", () => {
  it("has no secret keys in the app's code (the browser can read all of it)", () => {
    const offenders = files("src").filter((f) => /service_role|SERVICE_ROLE|sb_secret_|eyJhbGciOi/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("doesn't let just anyone read the bookings (customers' names, phones and addresses)", () => {
    const openReads = [...bookingPolicies()].filter(([, def]) => /for\s+select/i.test(def) && /using\s*\(\s*true\s*\)/i.test(def));
    expect(openReads.map(([name]) => name)).toEqual([]);
  });

  it("never lets .env.local be committed", () => {
    expect(readFileSync(".gitignore", "utf8")).toMatch(/^\.env\.local$/m);
  });
});
