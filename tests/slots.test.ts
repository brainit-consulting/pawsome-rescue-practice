import { describe, expect, it } from "vitest";
import { openSlots } from "@/lib/slots";

describe("open slots", () => {
  it("hides a taken time however the database writes it", () => {
    const nine = "2026-11-03T14:00:00.000Z";
    const ten = "2026-11-03T15:00:00.000Z";
    expect(openSlots([nine, ten], ["2026-11-03T14:00:00+00:00"])).toEqual([ten]);
  });
});
