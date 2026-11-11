"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
      setBusy(false);
      if (error) { setErr("Courriel ou mot de passe incorrect."); return; }
      router.push("/mon-espace");
      return;
    }
    if (pw.length < 8) { setBusy(false); setErr("Le mot de passe doit contenir au moins 8 caractères."); return; }
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pw, options: { emailRedirectTo: window.location.origin + "/mon-espace" } });
    setBusy(false);
    if (error) { setErr("Création impossible. Vérifiez votre courriel ou essayez de vous connecter."); return; }
    if (data.session) { router.push("/mon-espace"); return; }
    setMsg("Compte créé. Un courriel de confirmation vient de vous être envoyé : cliquez sur le lien, puis connectez-vous.");
  }

  return (
    <form className="formcard" onSubmit={submit}>
      <h2>{mode === "in" ? "Se connecter" : "Créer un compte"}</h2>
      <label>Courriel<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Mot de passe<input type="password" required autoComplete={mode === "in" ? "current-password" : "new-password"} value={pw} onChange={(e) => setPw(e.target.value)} /></label>
      {err && <p className="err" role="alert">{err}</p>}
      {msg && <p className="est" role="status">{msg}</p>}
      <button className="btn gold" type="submit" disabled={busy}>{busy ? "…" : mode === "in" ? "Se connecter" : "Créer mon compte"}</button>
      <button type="button" className="linkbtn" onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(""); setMsg(""); }}>
        {mode === "in" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
      </button>
    </form>
  );
}
