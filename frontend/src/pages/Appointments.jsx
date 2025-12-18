import React, { useEffect, useState } from "react";
import { createAppointment, getAuthInfo, myAppointments } from "../api.js";

export default function Appointments({ onNeedLogin }) {
  const auth = getAuthInfo();
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    dateTime: "",
    reason: ""
  });
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function load() {
    if (!auth.token) return;
    setLoading(true);
    try {
      const data = await myAppointments();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth.token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);

  async function submit(e) {
    e.preventDefault();
    setStatus(null);

    if (!auth.token) {
      onNeedLogin?.();
      return;
    }

    if (!form.patientName || !form.phone || !form.dateTime || !form.reason) {
      setStatus({ type: "err", msg: "Please fill all fields." });
      return;
    }

    try {
      await createAppointment(form);
      setStatus({ type: "ok", msg: "Appointment booked!" });
      setForm({ patientName: "", phone: "", dateTime: "", reason: "" });
      await load();
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Failed to book appointment.";
      setStatus({ type: "err", msg });
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Take Appointment</h2>
        <p className="p">
          Book an appointment. (Requires login)
        </p>

        {status && (
          <div className={"alert " + (status.type === "ok" ? "ok" : "err")} style={{ marginBottom: 12 }}>
            {status.msg}
          </div>
        )}

        <form className="form" onSubmit={submit}>
          <input className="input" placeholder="Patient name" value={form.patientName} onChange={(e) => set("patientName", e.target.value)} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className="input" type="datetime-local" value={form.dateTime} onChange={(e) => set("dateTime", e.target.value)} />
          <textarea className="input" rows="4" placeholder="Reason / Notes" value={form.reason} onChange={(e) => set("reason", e.target.value)} />
          <button className="btn primary" type="submit">Book</button>
          {!auth.token && <div className="small">You must login to book.</div>}
        </form>
      </section>

      <aside className="card">
        <h3 style={{ marginTop: 0 }}>My Appointments</h3>
        {!auth.token ? (
          <p className="p">Login to see your appointments.</p>
        ) : loading ? (
          <p className="p">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p">No appointments yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{String(a.appointmentDateTime).replace("T", " ")}</td>
                  <td>
                    <div><b>{a.patientName}</b></div>
                    <div className="small">{a.phone}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="small" style={{ marginTop: 12 }}>
          Stored in SQLite (`backend/preksha.db`).
        </p>
      </aside>
    </div>
  );
}
