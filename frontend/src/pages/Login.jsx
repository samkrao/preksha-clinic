import React, { useState } from "react";
import { login, setAuth } from "../api.js";

export default function Login({ onAuthed }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.email || !form.password) {
      setStatus({ type: "err", msg: "Email and password are required." });
      return;
    }

    try {
      const auth = await login(form);
      setAuth(auth);
      setStatus({ type: "ok", msg: "Logged in!" });
      onAuthed?.();
    } catch {
      setStatus({ type: "err", msg: "Invalid credentials (or backend not running)." });
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Login</h2>

      {status && (
        <div className={"alert " + (status.type === "ok" ? "ok" : "err")} style={{ marginBottom: 12 }}>
          {status.msg}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
        <button className="btn primary" type="submit">Login</button>
        <div className="small">Tip: register first, then login.</div>
      </form>
    </div>
  );
}
