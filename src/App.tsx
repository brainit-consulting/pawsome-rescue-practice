import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Owner from "./pages/Owner";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash === "#owner" ? <Owner /> : <Index />;
}
