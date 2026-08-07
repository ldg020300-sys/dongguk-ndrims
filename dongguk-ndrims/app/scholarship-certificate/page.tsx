"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AcademicShell from "@/components/AcademicShell";
import { supabase } from "@/lib/supabase";
import { Printer, Search } from "lucide-react";

export default function ScholarshipCertificatePage() {
  const router = useRouter();
  const [name, setName] = useState<string>("임동균");
  const [studentId, setStudentId] = useState<string>();
  const [major, setMajor] = useState<string>("약학과");
  const [year, setYear] = useState<number>(1);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");

      const { data } = await supabase
        .from("profiles")
        .select("name, student_id, major, year")
        .eq("id", user.id)
        .single();

      if (data?.name) setName(data.name);
      if (data?.student_id) setStudentId(data.student_id);
      if (data?.major) setMajor(data.major);
      if (data?.year) setYear(data.year);
    })();
  }, [router]);

  const isSecondStudent = studentId === "2026111767";

  return (
    <AcademicShell name={name}>
      <div className="workspace-tabs">
        <div className="tab">공지사항조회</div>
        <div className="tab">전체성적조회</div>
        <div className="tab active">장학수혜확인원출력</div>
      </div>

      <section className="scholarship-page">
        <div className="scholarship-breadcrumb">대표-학사행정 &gt; 장학 &gt; 장학수혜확인원출력</div>
        <h1>장학수혜확인원출력</h1>

        <div className="scholarship-filters">
          <label>
            <b>년도/학기</b>
            <select>
              <option>-전체-</option>
              {!isSecondStudent && <option>2026학년도 2학기</option>}
            </select>
          </label>
          <fieldset>
            <legend>출력언어</legend>
            <label><input type="radio" defaultChecked /> 국문</label>
            <label><input type="radio" /> 영문</label>
          </fieldset>
          <label><b>명예장학</b><input type="checkbox" /></label>
          <button><Search size={17}/> 조회</button>
        </div>

        {isSecondStudent ? (
          <div style={{ minHeight: "650px", border: "1px solid #d9d9d9", background: "#fff" }} />
        ) : (
          <>
            <div className="certificate-actions">
              <button onClick={() => window.print()}><Printer size={17}/> 인쇄</button>
            </div>

            <article className="scholarship-certificate">
              <header>
                <div className="certificate-school">동국대학교</div>
                <h2>장학수혜확인원</h2>
                <div className="certificate-number">발급번호: SCH-20260706-0001</div>
              </header>

              <section className="certificate-section">
                <h3>학생정보</h3>
                <div className="certificate-grid student">
                  <span>성명</span><strong>{name}</strong>
                  <span>학번</span><strong>{studentId ?? "2026110432"}</strong>
                  <span>학과</span><strong>{major}</strong>
                  <span>학년</span><strong>{year}학년</strong>
                </div>
              </section>

              <section className="certificate-section">
                <h3>장학금 수혜내역</h3>
                <div className="certificate-grid scholarship">
                  <span>장학금명</span><strong>성적우수장학금</strong>
                  <span>수혜학기</span><strong>2026학년도 2학기</strong>
                  <span>지급구분</span><strong>등록금 전액</strong>
                  <span>지급금액</span><strong>6,147,000원</strong>
                  <span>지급일</span><strong>2026-07-06</strong>
                  <span>수혜사유</span><strong>성적우수</strong>
                </div>
              </section>

              <p className="certificate-statement">
                상기 학생은 본교 장학금 지급 규정에 따라 아래와 같이 장학금을 수혜하였음을 증명합니다.
              </p>

              <footer className="certificate-footer">
                <div className="issue-date">2026년 7월 6일</div>
                <div className="issuer-row">
                  <div>동국대학교 총장</div>
                </div>
                <div className="certificate-disclaimer">수업용 웹 프로젝트 화면 · 공식 증명서가 아닙니다.</div>
              </footer>
            </article>
          </>
        )}
      </section>
    </AcademicShell>
  );
}
