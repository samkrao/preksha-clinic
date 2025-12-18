import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "err", msg: "Please fill all fields." });
      return;
    }
    // Frontend-only demo; connect to email/CRM later
    setStatus({ type: "ok", msg: "Thanks! We received your message (demo)." });
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Contact Us</h2>
      <p className="p">Add your clinic phone number, address, and email here.</p>

      {status && (
        <div className={"alert " + (status.type === "ok" ? "ok" : "err")} style={{ marginBottom: 12 }}>
          {status.msg}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="input" placeholder="Your email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <textarea className="input" rows="6" placeholder="Message" value={form.message} onChange={(e) => set("message", e.target.value)} />
        <button className="btn primary" type="submit">Send</button>
      </form>
    </div>
  );
}
