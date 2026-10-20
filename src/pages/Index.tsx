import { useEffect, useState } from "react";
import { listServices, listOpenSlots, createBooking, type Service } from "@/lib/data";
import { canConfirm, emptyForm, type BookingForm, type DogSize } from "@/lib/booking-form";

const sizes: { id: DogSize; label: string }[] = [
  { id: "small", label: "Small (under 25 lb)" },
  { id: "medium", label: "Medium (25–60 lb)" },
  { id: "large", label: "Large (over 60 lb)" },
];

const time = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" });

export default function Index() {
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listServices().then(setServices).catch((e) => setError(String(e.message ?? e)));
    listOpenSlots().then(setSlots).catch((e) => setError(String(e.message ?? e)));
  }, []);

  const set = (patch: Partial<BookingForm>) => setForm((f) => ({ ...f, ...patch }));
  const service = services.find((s) => s.id === form.serviceId);

  async function confirm() {
    try {
      await createBooking(form);
      setDone(true);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  }

  if (done)
    return (
      <Shell>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
          <h2 className="text-2xl font-bold">You're booked!</h2>
          <p className="mt-2">We'll see {form.dogName} on {time(form.slot)}. See you then.</p>
        </div>
      </Shell>
    );

  return (
    <Shell>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">Something went wrong: {error}</p>}
      <ol className="mb-6 flex gap-2 text-sm font-semibold">
        {["Service", "Time", "Your details"].map((label, i) => (
          <li key={label} className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-teal-700 text-white" : "bg-stone-200"}`}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section>
          <h2 className="text-xl font-bold">Pick a service</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => set({ serviceId: s.id })}
                className={`rounded-xl border p-4 text-left ${form.serviceId === s.id ? "border-teal-700 ring-2 ring-teal-700" : "border-stone-300 bg-white"}`}
              >
                <span className="block font-semibold">{s.name}</span>
                <span className="text-sm text-stone-600">
                  ${s.prices.small} / ${s.prices.medium} / ${s.prices.large} · {s.minutes} min
                </span>
              </button>
            ))}
          </div>
          <h3 className="mt-6 font-semibold">Your dog's size</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((z) => (
              <button
                key={z.id}
                onClick={() => set({ dogSize: z.id })}
                className={`rounded-lg border px-4 py-2 ${form.dogSize === z.id ? "border-teal-700 bg-teal-700 text-white" : "border-stone-300 bg-white"}`}
              >
                {z.label}
              </button>
            ))}
          </div>
          <Next disabled={!form.serviceId || !form.dogSize} onClick={() => setStep(2)} />
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="text-xl font-bold">Choose a time</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => set({ slot: s })}
                className={`rounded-lg border px-4 py-2 ${form.slot === s ? "border-teal-700 bg-teal-700 text-white" : "border-stone-300 bg-white"}`}
              >
                {time(s)}
              </button>
            ))}
          </div>
          <Next disabled={!form.slot} onClick={() => setStep(3)} />
        </section>
      )}

      {step === 3 && (
        <section className="max-w-xl">
          <h2 className="text-xl font-bold">Your details</h2>
          {service && form.dogSize && (
            <p className="mt-1 text-stone-600">
              {service.name}, {form.dogSize} dog, {time(form.slot)}: ${service.prices[form.dogSize]}
            </p>
          )}
          <Field label="Your name" value={form.customerName} onChange={(v) => set({ customerName: v })} />
          <Field label="Phone" placeholder="(555) 010-4242" value={form.phone} onChange={(v) => set({ phone: v })} />
          <Field label="Address" value={form.address} onChange={(v) => set({ address: v })} />
          <Field label="Your dog's name" value={form.dogName} onChange={(v) => set({ dogName: v })} />
          <button
            disabled={!canConfirm(form)}
            onClick={confirm}
            className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm booking
          </button>
        </section>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-stone-50 px-4 py-10 text-stone-900 sm:px-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Mobile dog grooming</p>
        <h1 className="mt-1 text-4xl font-bold">Pawsome Mobile Grooming</h1>
        <p className="mt-2 text-lg text-stone-600">Book online. We come to you, within 15 miles of Millbrook.</p>
      </header>
      {children}
      <footer className="mt-16 text-sm text-stone-500">
        <a href="#owner" className="underline">Owner sign-in</a>
      </footer>
    </main>
  );
}

function Next({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white disabled:opacity-40"
    >
      Continue
    </button>
  );
}

function Field(props: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-4 block">
      <span className="font-semibold">{props.label}</span>
      <input
        className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
