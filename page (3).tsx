"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Profile = { name: string; student_id: string; major: string; year: number; role: string };
type Notice = { id: number; title: string; created_at: string };

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profile);

      const { data: notices } = await supabase.from("notices").select("id,title,created_at").order("created_at", { ascending: false });
      setNotices(notices ?? []);
    })();
  }, [router]);

  const filtered = notices.filter(n => n.title.includes(keyword));

  return (
    <>
      <PortalHeader name={profile?.name} />
      <main className="container" style={{ padding: "30px 0 60px" }}>
        <h1 className="page-title">학사행정 메인</h1>

        <section className="card" style={{ padding: 22, marginBottom: 24 }}>
          <div className="panel-title">학생정보</div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
            <div><b>이름</b><p>{profile?.name ?? "-"}</p></div>
            <div><b>학번</b><p>{profile?.student_id ?? "-"}</p></div>
            <div><b>학과</b><p>{profile?.major ?? "-"}</p></div>
            <div><b>학년</b><p>{profile ? `${profile.year}학년` : "-"}</p></div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/mypage" className="btn btn-secondary">마이페이지</Link>
            {profile?.role === "admin" && <Link href="/admin" className="btn btn-primary">관리자 페이지</Link>}
          </div>
        </section>

        <section className="card" style={{ padding: 22 }}>
          <div className="panel-title">공지사항조회</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <input className="input" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="제목 검색" />
            <button className="btn btn-secondary">조회</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th style={{ width: 80 }}>No</th><th>제목</th><th style={{ width: 140 }}>작성일</th></tr></thead>
              <tbody>
                {filtered.map((n, i) => (
                  <tr key={n.id}>
                    <td>{i + 1}</td>
                    <td><Link href={`/notices/${n.id}`}>{n.title}</Link></td>
                    <td>{new Date(n.created_at).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={3}>등록된 공지사항이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
