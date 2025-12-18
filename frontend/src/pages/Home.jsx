import React, { useEffect, useState } from "react";
import { getAuthInfo, me } from "../api.js";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const auth = getAuthInfo();

  useEffect(() => {
    let ignore = false;
    async function load() {
      setErr("");
      setProfile(null);
      if (!auth.token) return;
      try {
        const data = await me();
        if (!ignore) setProfile(data);
      } catch {
        if (!ignore) setErr("Could not load profile.");
      }
    }
    load();
    return () => { ignore = true; };
  }, [auth.token]);

  return (
    <div className="grid">
      <section className="card">
        <h1 className="h1">Welcome to Preksha Clinic</h1>
        <p className="p">
          This starter website includes Home, About, Contact, Register/Login, and an Appointment booking page.
          Customize the text to match your clinic’s services, timings, location, and doctor details.
        </p>

        <div className="row" style={{ marginTop: 12 }}>
          <span className="badge">Online Appointments</span>
          <span className="badge">Secure Login</span>
          <span className="badge">SQLite + DataNucleus</span>
        </div>
      </section>

      <aside className="card">
        <h3 style={{ marginTop: 0 }}>Your Account</h3>
        {!auth.token ? (
          <p className="p">Login or Register to book appointments.</p>
        ) : (
          <>
            {err && <div className="alert err">{err}</div>}
            {profile ? (
              <div className="alert ok">
                <div><b>Name:</b> {profile.name}</div>
                <div><b>Email:</b> {profile.email}</div>
              </div>
            ) : (
              !err && <p className="p">Loading…</p>
            )}
          </>
        )}
        <p className="small" style={{ marginTop: 12 }}>
          Tip: after login, go to “Take Appointment”.
        </p>
      </aside>
    </div>
  );
}
