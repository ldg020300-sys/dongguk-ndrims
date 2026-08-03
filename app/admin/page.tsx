"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.replace("/");
    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (p?.role !== "admin") return router.replace("/dashboard");
    setProfile(p);

    const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    setNotices(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function createNotice(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("notices").insert({ title: form.title, content: form.content, author_id: profile.id });
    setForm({ title: "", content: "" });
    load();
  }

  async function remove(id: number) {
    if (!confirm("이 공지를 삭제할까요?")) return;
    await supabase.from("notices").delete().eq("id", id);
    load();
  }

  return (
    <>
      <PortalHeader name={profile?.name} />
      <main className="container" style={{ padding: "30px 0" }}>
        <h1 className="page-title">관리자 페이지</h1>

        <form onSubmit={createNotice} className="card grid" style={{ padding: 22, marginBottom: 22 }}>
          <div className="panel-title">공지사항 작성</div>
          <input className="input" placeholder="제목" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="input" style={{ minHeight: 160 }} placeholder="내용" required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          <button className="btn btn-primary">등록</button>
        </form>

        <section className="card" style={{ padding: 22 }}>
          <div className="panel-title">공지사항 관리</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>제목</th><th style={{ width: 110 }}>관리</th></tr></thead>
              <tbody>
                {notices.map(n => <tr key={n.id}><td>{n.title}</td><td><button className="btn btn-secondary" onClick={() => remove(n.id)}>삭제</button></td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
