"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Search, Settings, FileText, Layers, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const baseGroups = [
  { title: "학생신청(기타)", items: ["개인정보수집동의", "[학생신청]신청함", "[학생신청]진행함", "[학생신청]완료함"] },
  { title: "학적/확인서", items: ["학적부열람", "신상정보수정", "전과합격자발표", "트랙제/Degree조회", "봉사인증서출력", "수상확인서출력"] },
  { title: "수강신청", items: ["희망강의신청", "수강강의내역확인", "수강신청(폐강대체)", "수강취소신청", "교양과목특별수강", "군이러닝수강신청", "탐색학점제신청", "IC신청"] },
  { title: "수업/강의평가", items: ["강의시간표", "강의평가", "수업계획서"] },
  { title: "성적", items: ["평가항목별성적조회", "성적공시", "이수구분별성적조회", "전체성적조회"] },
  { title: "장학", items: ["장학수혜확인원출력", "장학미수혜확인원출력", "불교대학행사참여확인"] },
  { title: "등록", items: ["등록금조회", "납부확인서"] },
  { title: "교직", items: ["교직이수현황"] },
  { title: "졸업", items: ["졸업요건", "졸업사정"] },
  { title: "현장실습", items: ["현장실습신청"] },
  { title: "예비군", items: ["예비군신청"] },
];

const inquiryGroup = {
  title: "학사문의",
  items: ["학사행정문의", "장학문의", "등록문의", "수강문의"],
};

export default function AcademicSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>(["학적/확인서"]);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("student_id")
        .eq("id", user.id)
        .single();

      setStudentId(data?.student_id ?? null);
    })();
  }, []);

  // 기존 약학과 학생 계정에서만 학사문의 메뉴를 표시합니다.
  const groups = useMemo(
    () => studentId === "2026110432" ? [...baseGroups, inquiryGroup] : baseGroups,
    [studentId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => item.toLowerCase().includes(q) || group.title.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  function toggle(title: string) {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((v) => v !== title) : [...prev, title]
    );
  }

  return (
    <aside className="academic-sidebar">
      <div className="sidebar-heading">대표-학사행정</div>
      <div className="sidebar-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="메뉴명을 입력하세요."
        />
        <Search size={22} />
      </div>

      <div className="sidebar-tabs">
        <button className="active">전체메뉴</button>
        <button>마이메뉴</button>
        <Settings size={18} />
      </div>

      <nav className="sidebar-nav">
        {filtered.map((group) => {
          const open = openGroups.includes(group.title) || query.length > 0;

          return (
            <div key={group.title} className={`menu-group ${open ? "open" : ""}`}>
              <button className="menu-group-button" onClick={() => toggle(group.title)}>
                <span>{group.title}</span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {open && (
                <div className="menu-items">
                  {group.items.map((item) => {
                    const isStudentRecord = item === "학적부열람";
                    const isAllGrades = item === "전체성적조회";
                    const isScholarshipCertificate = item === "장학수혜확인원출력";
                    const isAcademicInquiry = item === "학사행정문의";

                    const href = isStudentRecord
                      ? "/student-record"
                      : isAllGrades
                        ? "/grades"
                        : isScholarshipCertificate
                          ? "/scholarship-certificate"
                          : isAcademicInquiry
                            ? "/academic-inquiry"
                            : "#";

                    const active =
                      (isStudentRecord && pathname === "/student-record") ||
                      (isAllGrades && pathname === "/grades") ||
                      (isScholarshipCertificate && pathname === "/scholarship-certificate") ||
                      (isAcademicInquiry && pathname === "/academic-inquiry");

                    const isImplemented =
                      isStudentRecord ||
                      isAllGrades ||
                      isScholarshipCertificate ||
                      isAcademicInquiry;

                    return (
                      <Link
                        key={item}
                        href={href}
                        className={`menu-item ${active ? "active" : ""}`}
                        onClick={(e) => {
                          if (!isImplemented) {
                            e.preventDefault();
                            alert("준비 중인 기능입니다.");
                          }
                        }}
                      >
                        {isAcademicInquiry
                          ? <MessageSquareText size={16} />
                          : isImplemented
                            ? <FileText size={16} />
                            : <Layers size={16} />}
                        <span>{item}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
