"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, loginEmailFromId } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", studentId: "", password: "", major: "약학과", year: 1 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: loginEmailFromId(form.studentId),
      password: form.password
    });

    if (error || !data.user) {
      setError(error?.message ?? "회원가입에 실패했습니다.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      student_id: form.studentId,
      name: form.name,
      major: form.major,
      year: form.year,
      role: "student"
    });

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setMessage("회원가입이 완료되었습니다. 로그인해주세요.");
    setTimeout(() => router.push("/"), 1200);
  }

  return (
    <main className="container" style={{ padding: "42px 0" }}>
      <div className="card" style={{ maxWidth: 560, margin: "0 auto", padding: 30 }}>
        <h1>회원가입</h1>
        <p style={{ color: "#666" }}>학번이 로그인 아이디로 사용됩니다.</p>

        <form onSubmit={submit} className="grid">
          <label><span className="label">이름</span><input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label><span className="label">학번</span><input className="input" required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} /></label>
          <label><span className="label">비밀번호</span><input className="input" type="password" minLength={8} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
          <label><span className="label">학과</span><input className="input" required value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} /></label>
          <label><span className="label">학년</span><select className="input" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })}><option value={1}>1학년</option><option value={2}>2학년</option><option value={3}>3학년</option><option value={4}>4학년</option></select></label>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary">회원가입</button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/")}>로그인으로 돌아가기</button>
        </form>
      </div>
    </main>
  );
}
