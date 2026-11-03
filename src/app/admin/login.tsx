"use client";

import { useActionState } from "react";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { loginAction } from "./actions";
import type { ActionResult } from "@/lib/types";

const initialState: ActionResult = { ok: false, message: "" };

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="admin-login-shell">
      <section className="admin-login-brand">
        <a href="/" className="admin-brand-mark" aria-label="Back to portfolio">DO<span>®</span></a>
        <div>
          <p className="eyebrow text-emerald-300">Private workspace</p>
          <h1>Content,<br /><em>under control.</em></h1>
          <p>Publish case studies, experience, and credentials to the live portfolio from one focused workspace.</p>
        </div>
        <div className="admin-security-note"><ShieldCheck size={18} /><span>Signed, HTTP-only sessions<br />Scrypt-hashed local credentials</span></div>
      </section>
      <section className="admin-login-panel">
        <form action={formAction} className="admin-login-form">
          <div className="admin-key-icon"><KeyRound size={22} /></div>
          <p className="eyebrow">CMS access</p>
          <h2>Welcome back.</h2>
          <p className="admin-login-copy">Use your local administrator credentials. Both fields are required.</p>
          <label>Username<input name="username" autoComplete="username" required maxLength={80} placeholder="Admin username" /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={200} placeholder="Your password" /></label>
          {state.message && <p className="admin-form-error" role="alert">{state.message}</p>}
          <button type="submit" className="admin-primary-button" disabled={pending}>
            {pending ? "Verifying…" : "Enter dashboard"}<ArrowRight size={18} />
          </button>
          <a href="/" className="admin-back-link">Return to public portfolio</a>
        </form>
      </section>
    </main>
  );
}
