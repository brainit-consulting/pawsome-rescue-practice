import { describe, expect, it } from "vitest";
import { canConfirm, emptyForm, isValidPhone } from "@/lib/booking-form";

const filled = {
  ...emptyForm,
  serviceId: "bath",
  dogSize: "small" as const,
  slot: "2026-11-03T14:00:00.000Z",
  customerName: "Dana Ruiz",
  address: "14 Elm Street, Millbrook",
  dogName: "Biscuit",
};

describe("booking form", () => {
  it("accepts phone numbers the way people type them", () => {
    for (const phone of ["(555) 010-4242", "555-010-4242", "555 010 4242", "5550104242"]) expect(isValidPhone(phone), phone).toBe(true);
  });

  it("still rejects numbers that are too short", () => {
    expect(isValidPhone("010-42")).toBe(false);
  });

  it("lets a customer confirm once everything is filled in", () => {
    expect(canConfirm({ ...filled, phone: "(555) 010-4242" })).toBe(true);
  });
});
