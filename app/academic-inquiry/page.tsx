"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AcademicShell from "@/components/AcademicShell";
import { supabase } from "@/lib/supabase";
import { MessageSquarePlus, Search } from "lucide-react";

type Inquiry = {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  status: "답변대기" | "답변완료";
  content: string;
  answer: string;
};

const initialInquiry: Inquiry = {
  id: 1,
  category: "학사행정",
  title: "행정시스템 오류",
  author: "임동균",
  date: "2026-08-03",
  status: "답변대기",
  content: `안녕하세요 본 학교 행정 시스템에서 오류가 있는 거 같아 문의 남깁니다. 저는 현재 약학대학에 재학중임에도 식품바이오융합공학과에도 동시에 재학중으로 나옵니다. 현재 학사행정시스템에도 두 학번 모두 로그인이 가능한 상태입니다. 저번 입학키트 수령 당시 두 학과 모두에게서 입학키트를 받았고 그 당시 전화로 제가 제 학사 시스템에 오류가 있는 거 같다고 말씀드렸었는데 아직 제대로 처리되지 않은 것 같습니다. 그래서 최근 또 다시 집으로 학사경고 우편이 도착했고 부모님께서 괜한 걱정을 하셨습니다. 하루빨리 수정 부탁드립니다.`,
  answer: "",
};

const storageKey = "dongguk-academic-inquiries-2026110432";

export default function AcademicInquiryPage() {
  const router = useRouter();
  const [name, setName] = useState<string>();
  const [studentId, setStudentId] = useState<string>();
  const [inquiries, setInquiries] = useState<Inquiry[]>([initialInquiry]);
  const [selectedId, setSelectedId] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");

      const { data } = await supabase
        .from("profiles")
        .select("name, student_id")
        .eq("id", user.id)
        .single();

      setName(data?.name);
      setStudentId(data?.student_id);
    })();

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Inquiry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInquiries(parsed);
          setSelectedId(parsed[0].id);
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(inquiries));
  }, [inquiries]);

  const filtered = useMemo(
    () =>
      inquiries.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.category.toLowerCase().includes(keyword.toLowerCase())
      ),
    [inquiries, keyword]
  );

  const selected =
    inquiries.find((item) => item.id === selectedId) ??
    filtered[0] ??
    inquiries[0];

  function addInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category") ?? "학사행정");
    const title = String(form.get("title") ?? "").trim();
    const content = String(form.get("content") ?? "").trim();

    if (!title || !content) {
      alert("제목과 문의내용을 입력해 주세요.");
      return;
    }

    const next: Inquiry = {
      id: Date.now(),
      category,
      title,
      author: name ?? "임동균",
      date: new Date().toISOString().slice(0, 10),
      status: "답변대기",
      content,
      answer: "",
    };

    setInquiries((prev) => [next, ...prev]);
    setSelectedId(next.id);
    setShowForm(false);
    event.currentTarget.reset();
    alert("문의가 정상적으로 등록되었습니다.");
  }

  if (studentId && studentId !== "2026110432") {
    return (
      <AcademicShell name={name}>
        <div style={{ padding: 32 }}>
          <h1 style={{ marginBottom: 16 }}>학사행정문의</h1>
          <div style={{ border: "1px solid #ddd", padding: 48, textAlign: "center", background: "#fff" }}>
            준비 중인 기능입니다.
          </div>
        </div>
      </AcademicShell>
    );
  }

  return (
    <AcademicShell name={name}>
      <div className="workspace-tabs">
        <div className="tab">공지사항조회</div>
        <div className="tab active">학사행정문의</div>
      </div>

      <section style={{ padding: "22px 28px 32px" }}>
        <div style={{ fontSize: 12, color: "#999", textAlign: "right", marginBottom: 6 }}>
          대표-학사행정 &gt; 학사문의 &gt; 학사행정문의
        </div>

        <h1 style={{ margin: "0 0 22px", fontSize: 24 }}>학사행정문의</h1>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: 14,
            border: "1px solid #ddd",
            background: "#fafafa",
            marginBottom: 14,
          }}
        >
          <strong style={{ whiteSpace: "nowrap" }}>문의검색</strong>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="문의유형 또는 제목을 입력하세요."
            style={{ flex: 1, height: 38, border: "1px solid #d5d5d5", padding: "0 12px" }}
          />
          <button
            type="button"
            style={{
              height: 38,
              padding: "0 18px",
              border: 0,
              background: "#91877f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Search size={16} /> 조회
          </button>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            style={{
              height: 38,
              padding: "0 18px",
              border: 0,
              background: "#d94724",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MessageSquarePlus size={16} /> 문의등록
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addInquiry}
            style={{
              border: "1px solid #bbb",
              background: "#fff",
              padding: 18,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderTop: "2px solid #333" }}>
              <label style={labelStyle}>문의유형</label>
              <div style={valueStyle}>
                <select name="category" defaultValue="학사행정" style={inputStyle}>
                  <option>학사행정</option>
                  <option>수강</option>
                  <option>장학</option>
                  <option>등록</option>
                  <option>휴학·복학</option>
                  <option>증명서</option>
                  <option>기타</option>
                </select>
              </div>

              <label style={labelStyle}>제목</label>
              <div style={valueStyle}>
                <input name="title" style={inputStyle} />
              </div>

              <label style={labelStyle}>문의내용</label>
              <div style={valueStyle}>
                <textarea name="content" rows={7} style={{ ...inputStyle, height: "auto", padding: 10, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button type="button" onClick={() => setShowForm(false)} style={secondaryButtonStyle}>
                취소
              </button>
              <button type="submit" style={primaryButtonStyle}>
                등록
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "43% 57%", minHeight: 610, border: "1px solid #d7d7d7", background: "#fff" }}>
          <div style={{ borderRight: "1px solid #d7d7d7" }}>
            <div style={sectionTitleStyle}>
              <span>문의목록</span>
              <strong>{filtered.length}건</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "52px 90px 1fr 105px 86px", background: "#f1f2f3", borderBottom: "1px solid #ddd", fontWeight: 700 }}>
              {["No", "문의유형", "제목", "작성일", "처리상태"].map((text) => (
                <div key={text} style={{ padding: "11px 8px", textAlign: "center" }}>{text}</div>
              ))}
            </div>

            {filtered.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: "52px 90px 1fr 105px 86px",
                  border: 0,
                  borderBottom: "1px solid #e2e2e2",
                  background: selected?.id === item.id ? "#fff8ba" : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  font: "inherit",
                }}
              >
                <span style={cellCenter}>{index + 1}</span>
                <span style={cellCenter}>{item.category}</span>
                <span style={cellText}>{item.title}</span>
                <span style={cellCenter}>{item.date}</span>
                <span style={{ ...cellCenter, color: "#d94724", fontWeight: 700 }}>{item.status}</span>
              </button>
            ))}
          </div>

          <div>
            <div style={sectionTitleStyle}>문의 상세내용</div>

            {selected ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 110px 1fr", borderTop: "2px solid #333" }}>
                  <div style={labelStyle}>문의유형</div><div style={valueStyle}>{selected.category}</div>
                  <div style={labelStyle}>처리상태</div><div style={{ ...valueStyle, color: "#d94724", fontWeight: 700 }}>{selected.status}</div>
                  <div style={labelStyle}>제목</div><div style={{ ...valueStyle, gridColumn: "span 3" }}>{selected.title}</div>
                  <div style={labelStyle}>작성자</div><div style={valueStyle}>{selected.author}</div>
                  <div style={labelStyle}>작성일</div><div style={valueStyle}>{selected.date}</div>
                  <div style={labelStyle}>문의내용</div>
                  <div style={{ ...valueStyle, gridColumn: "span 3", minHeight: 240, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                    {selected.content}
                  </div>
                </div>

                <div style={{ margin: "18px 16px 0", borderTop: "2px solid #333" }}>
                  <div style={{ padding: "11px 12px", background: "#f1f2f3", fontWeight: 800 }}>답변</div>
                  <div style={{ minHeight: 120, border: "1px solid #ddd", padding: 18, color: selected.answer ? "#222" : "#999", whiteSpace: "pre-wrap" }}>
                    {selected.answer || "등록된 답변이 없습니다."}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: 60, textAlign: "center", color: "#999" }}>문의를 선택해 주세요.</div>
            )}
          </div>
        </div>
      </section>
    </AcademicShell>
  );
}

const labelStyle = {
  background: "#f1f2f3",
  padding: "11px 12px",
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
  fontWeight: 700,
} as const;

const valueStyle = {
  padding: "11px 12px",
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
} as const;

const inputStyle = {
  width: "100%",
  height: 36,
  border: "1px solid #ccc",
  padding: "0 10px",
  boxSizing: "border-box",
  font: "inherit",
} as const;

const primaryButtonStyle = {
  border: 0,
  padding: "9px 22px",
  background: "#d94724",
  color: "#fff",
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  border: "1px solid #bbb",
  padding: "9px 22px",
  background: "#fff",
  cursor: "pointer",
} as const;

const sectionTitleStyle = {
  minHeight: 45,
  padding: "0 14px",
  borderBottom: "2px solid #222",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontWeight: 800,
} as const;

const cellCenter = {
  padding: "12px 7px",
  textAlign: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

const cellText = {
  padding: "12px 8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;
