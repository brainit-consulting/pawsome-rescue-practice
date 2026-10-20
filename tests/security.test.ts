import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : [join(dir, n)]));

describe("security", () => {
  it("has no secret keys in the app's code (the browser can read all of it)", () => {
    const offenders = files("src").filter((f) => /service_role|SERVICE_ROLE|eyJhbGciOi/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("doesn't let just anyone read the bookings (customers' names, phones and addresses)", () => {
    const sql = files("supabase/migrations").map((f) => readFileSync(f, "utf8")).join("\n");
    const openRead = /create policy[^;]*on public\.bookings\s+for select using \(true\)/i;
    expect(sql).not.toMatch(openRead);
  });
});
