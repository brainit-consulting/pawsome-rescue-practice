import { useEffect, useState } from "react";
import { listAllBookings, type Booking } from "@/lib/data";
import { supabase, isConnected } from "@/integrations/supabase/client";

export default function Owner() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listAllBookings().then(setBookings);
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) {
      setSignedIn(true);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setSignedIn(true);
  }

  return (
    <main className="min-h-dvh bg-stone-50 px-4 py-10 text-stone-900 sm:px-10">
      <a href="#" className="text-sm underline">← Back to booking</a>
      <h1 className="mt-4 text-3xl font-bold">Owner</h1>

      {!signedIn && (
        <form onSubmit={signIn} className="mt-4 flex max-w-md flex-col gap-3 rounded-xl border border-stone-300 bg-white p-5">
          <p className="font-semibold">Sign in to manage bookings</p>
          <input className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">Sign in</button>
          {message && <p className="text-red-800">{message}</p>}
        </form>
      )}

      <h2 className="mt-8 text-2xl font-bold">Today's jobs</h2>
      <p className="mt-1 text-stone-600">Every booking, in order.</p>
      <table className="mt-6 w-full max-w-4xl border-collapse text-left">
        <thead>
          <tr className="border-b border-stone-400">
            <th className="py-2 pr-4">When</th>
            <th className="py-2 pr-4">Customer</th>
            <th className="py-2 pr-4">Phone</th>
            <th className="py-2 pr-4">Address</th>
            <th className="py-2">Dog</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-stone-200">
              <td className="py-2 pr-4">{new Date(b.starts_at).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}</td>
              <td className="py-2 pr-4">{b.customer_name}</td>
              <td className="py-2 pr-4">{b.phone}</td>
              <td className="py-2 pr-4">{b.address}</td>
              <td className="py-2">{b.dog_name} ({b.dog_size})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
