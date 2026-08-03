"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Globe2, LockKeyhole, UserRound } from "lucide-react";
import { supabase, loginEmailFromId } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmailFromId(studentId),
      password
    });

    setLoading(false);

    if (error) {
      setError("학번 또는 비밀번호를 확인해주세요.");
      return;
    }

    if (saveId) localStorage.setItem("savedStudentId", studentId);
    else localStorage.removeItem("savedStudentId");

    router.push("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ height: 88, display: "flex", alignItems: "center" }} className="container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/dongguk-logo-clean.png"
            alt="동국대학교"
            style={{
              display: "block",
              width: "clamp(205px, 18vw, 255px)",
              maxHeight: 66,
              height: "auto",
              objectFit: "contain"
            }}
          />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <Globe2 size={20} /> KR
        </div>
      </div>

      <section style={{
        minHeight: 650,
        background: "linear-gradient(rgba(46,88,133,.72),rgba(35,66,99,.74)), url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=80') center/cover"
      }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr minmax(320px,520px)", gap: 48, alignItems: "center", minHeight: 650 }}>
          <div style={{ color: "white" }}>
            <div style={{ width: 46, height: 4, background: "#ff7a22", marginBottom: 22 }} />
            <h1 style={{ fontSize: "clamp(34px,5vw,58px)", margin: 0 }}>학사행정정보시스템</h1>
            <p style={{ fontSize: 19, lineHeight: 1.5 }}>Dongguk University<br />Academic Information System</p>
          </div>

          <form onSubmit={submit} className="card" style={{ padding: "34px clamp(22px,5vw,48px)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, border: "1px solid #ddd", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 18px", color: "#e95414" }}>
                <LockKeyhole />
              </div>
              <h2 style={{ fontSize: 36, margin: "0 0 8px" }}>로그인</h2>
              <p style={{ color: "#666", marginBottom: 26 }}>학번(아이디)과 비밀번호를 입력해주세요.</p>
            </div>

            <div className="grid">
              <label>
                <span className="label">학번</span>
                <div style={{ position: "relative" }}>
                  <UserRound size={20} style={{ position: "absolute", left: 14, top: 14, color: "#6f6b68" }} />
                  <input className="input" style={{ paddingLeft: 44 }} value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="학번을 입력해주세요." required />
                </div>
              </label>

              <label>
                <span className="label">비밀번호</span>
                <div style={{ position: "relative" }}>
                  <LockKeyhole size={20} style={{ position: "absolute", left: 14, top: 14, color: "#6f6b68" }} />
                  <input className="input" style={{ paddingLeft: 44 }} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요." type="password" required />
                </div>
              </label>

              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={saveId} onChange={e => setSaveId(e.target.checked)} /> 학번 저장
              </label>

              {error && <div className="error">{error}</div>}

              <button className="btn btn-primary" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</button>

              <div style={{ textAlign: "center", color: "#666" }}>
                <button type="button" onClick={() => router.push("/signup")} style={{ border: 0, background: "transparent" }}>회원가입</button>
                <span>　|　</span>
                <span>학번 찾기</span>
                <span>　|　</span>
                <span>비밀번호 찾기</span>
              </div>
            </div>
          </form>
        </div>
      </section>

      <footer className="container" style={{ padding: "28px 0 42px", color: "#5f5b58" }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          <div><b>서울캠퍼스</b><p>04620 서울특별시 중구 필동로 1길 30 동국대학교</p><p>02-2260-3114</p></div>
          <div><b>바이오메디캠퍼스</b><p>10326 경기도 고양시 일산동구 동국로 32</p><p>02-2260-3114</p></div>
        </div>
      </footer>

      <style jsx>{`
        @media (max-width: 860px) {
          section > div { grid-template-columns: 1fr !important; padding: 34px 0; }
          section > div > div:first-child { display: none; }
        }
      `}</style>
    </main>
  );
}
