import { supabase, isConnected } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin";
import type { BookingForm, DogSize } from "./booking-form";

export type Service = { id: string; name: string; minutes: number; prices: Record<DogSize, number> };
export type Booking = {
  id: string;
  service_id: string;
  dog_size: DogSize;
  starts_at: string;
  customer_name: string;
  phone: string;
  address: string;
  dog_name: string;
};

// Sample data, used until a Supabase project is connected
const sampleServices: Service[] = [
  { id: "bath", name: "Bath and brush", minutes: 60, prices: { small: 55, medium: 70, large: 85 } },
  { id: "groom", name: "Full groom (bath, haircut, nails)", minutes: 120, prices: { small: 75, medium: 95, large: 120 } },
  { id: "nails", name: "Nail trim", minutes: 30, prices: { small: 20, medium: 20, large: 25 } },
];
const sampleBookings: Booking[] = [
  { id: "b1", service_id: "groom", dog_size: "medium", starts_at: nextWeekday(9), customer_name: "Dana Ruiz", phone: "(555) 010-1188", address: "14 Elm Street, Millbrook", dog_name: "Biscuit" },
  { id: "b2", service_id: "bath", dog_size: "small", starts_at: nextWeekday(13), customer_name: "Sam Okafor", phone: "(555) 010-7720", address: "2 Mill Lane, Millbrook", dog_name: "Pepper" },
];

function nextWeekday(hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 1) d.setDate(d.getDate() + 1);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export async function listServices(): Promise<Service[]> {
  if (!isConnected) return sampleServices;
  const { data, error } = await supabase.from("services").select("*").order("minutes");
  if (error) throw error;
  return data as Service[];
}

/** Open start times for the next working day: Tuesday to Saturday, 8 am to 5 pm, on the hour */
export async function listOpenSlots(): Promise<string[]> {
  const taken = new Set((await listAllBookings()).map((b) => b.starts_at));
  const slots: string[] = [];
  for (let hour = 8; hour < 17; hour++) {
    const s = nextWeekday(hour);
    if (!taken.has(s)) slots.push(s);
  }
  return slots;
}

export async function createBooking(form: BookingForm): Promise<void> {
  const row = {
    service_id: form.serviceId,
    dog_size: form.dogSize,
    starts_at: form.slot,
    customer_name: form.customerName,
    phone: form.phone,
    address: form.address,
    dog_name: form.dogName,
  };
  if (!isConnected) {
    sampleBookings.push({ id: crypto.randomUUID(), ...row } as Booking);
    return;
  }
  const { error } = await supabase.from("bookings").insert(row);
  if (error) throw error;
}

/** Every booking, for the owner's page */
export async function listAllBookings(): Promise<Booking[]> {
  if (!isConnected) return [...sampleBookings].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const { data, error } = await supabaseAdmin.from("bookings").select("*").order("starts_at");
  if (error) throw error;
  return data as Booking[];
}
