import React, { useState } from "react";
import { register, setAuth } from "../api.js";

export default function Register({ onAuthed }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.name || !form.email || !form.password) {
      setStatus({ type: "err", msg: "All fields are required." });
      return;
    }
    if (form.password.length < 6) {
      setStatus({ type: "err", msg: "Password must be at least 6 characters." });
      return;
    }

    try {
      const auth = await register(form);
      setAuth(auth);
      setStatus({ type: "ok", msg: "Registered and logged in!" });
      onAuthed?.();
    } catch (e2) {
      const msg = e2?.response?.status === 409 ? "Email already registered." : "Register failed.";
      setStatus({ type: "err", msg });
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Register</h2>

      {status && (
        <div className={"alert " + (status.type === "ok" ? "ok" : "err")} style={{ marginBottom: 12 }}>
          {status.msg}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
        <button className="btn primary" type="submit">Create account</button>
        <div className="small">Backend stores passwords securely (BCrypt).</div>
      </form>
    </div>
  );
}
