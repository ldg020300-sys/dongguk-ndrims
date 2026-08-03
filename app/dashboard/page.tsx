"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AcademicShell from "@/components/AcademicShell";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

type Profile = { name: string; student_id: string; major: string; year: number; role: string };
type Notice = { id: number; title: string; content: string; created_at: string };

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);
      const { data: noticeData } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      const rows = noticeData ?? [];
      setNotices(rows);
      if (rows[0]) setSelectedId(rows[0].id);
    })();
  }, [router]);

  const filtered = useMemo(() => notices.filter((n) => n.title.toLowerCase().includes(keyword.toLowerCase())), [notices, keyword]);
  const selected = notices.find((n) => n.id === selectedId) ?? filtered[0];

  return (
    <AcademicShell name={profile?.name}>
      <div className="workspace-tabs">
        <div className="tab active">공지사항조회</div>
      </div>
      <section className="notice-workspace">
        <div className="workspace-heading">공지사항조회</div>
        <div className="notice-filters">
          <label><span>시스템단위</span><select><option>- 전체 -</option></select></label>
          <label><span>작성일자</span><input type="date" /><b>~</b><input type="date" /></label>
          <label className="title-filter"><span>제목</span><input value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>
          <button><Search size={17} /> 조회</button>
        </div>

        <div className="split-notice">
          <div className="notice-list-panel">
            <div className="section-bar"><span>공지사항목록</span><strong>{filtered.length}건</strong></div>
            <div className="notice-grid-header"><span>No</span><span>제목</span><span>작성일</span></div>
            <div className="notice-list-scroll">
              {filtered.map((n, i) => (
                <button key={n.id} className={`notice-row ${selected?.id === n.id ? "selected" : ""}`} onClick={() => setSelectedId(n.id)}>
                  <span>{i + 1}</span><span>{n.title}</span><span>{new Date(n.created_at).toLocaleDateString("ko-KR")}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="notice-detail-panel">
            <div className="section-bar"><span>상세정보</span></div>
            {selected ? (
              <>
                <div className="detail-meta-grid">
                  <div className="meta-label">제목</div><div className="meta-value wide">{selected.title}</div>
                  <div className="meta-label">작성자</div><div className="meta-value">교무팀</div>
                  <div className="meta-label">작성일</div><div className="meta-value">{new Date(selected.created_at).toLocaleDateString("ko-KR")}</div>
                  <div className="meta-label">조회수</div><div className="meta-value">2</div>
                </div>
                <article className="notice-detail-content">
                  <h3>{selected.title}</h3>
                  <p>{selected.content}</p>
                  <p className="notice-emphasis">※ 본 화면은 학교 과제용으로 제작된 학사행정정보시스템입니다.</p>
                  <p>자세한 사항은 담당 부서에 문의하시기 바랍니다.</p>
                </article>
                <div className="attachment-box"><b>첨부파일</b><span>조회된 자료가 없습니다.</span></div>
              </>
            ) : <div className="empty-detail">공지사항을 선택하세요.</div>}
          </div>
        </div>
      </section>
    </AcademicShell>
  );
}
