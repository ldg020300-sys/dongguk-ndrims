"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AcademicShell from "@/components/AcademicShell";
import { supabase } from "@/lib/supabase";

const gradeRows = [
  ["1", "2026", "1학기", "EGC9005", "01", "컴퓨터알고리즘의이해", "일교", "자연", "정진우", "1.0", "A+", "", "Y", "MSC/BSM"],
  ["2", "", "", "DEV1032", "01", "대학생의 자기주도적 학습전략", "일교", "자기계발", "이영", "2.0", "A+", "", "N", ""],
  ["3", "", "", "EGC9009", "01", "친환경수업세계로의초대", "일교", "자연", "이한준", "1.0", "A+", "", "N", ""],
  ["4", "", "", "RGC1053", "02", "기업가정신과 리더십", "공교", "자기계발", "이창영", "2.0", "A+", "", "Y", "전문교양"],
  ["5", "", "", "EGC3051", "01", "대학생을위한실용금융", "일교", "사회", "정병찬", "2.0", "A+", "", "N", ""],
  ["6", "", "", "PRI4003", "10", "일반화학및실험1", "학기", "제4영역:자연과학", "임재희", "4.0", "A+", "", "Y", "MSC/BSM"],
  ["7", "", "", "RGC0003", "09", "불교와인간", "공교", "동국인성", "최원섭", "2.0", "A+", "", "Y", "전문교양"],
  ["8", "", "", "EGC2108", "01", "일본한자문화세게이해하기", "일교", "인문", "이경철", "1.0", "A+", "", "N", ""],
  ["9", "", "", "PRI4004", "04", "일반생물학및실험1", "학기", "제4영역:자연과학", "정상민", "3.0", "A+", "", "Y", "MSC/BSM"],
];

const headers = ["No", "년도", "학기", "학수번호", "분반", "교과목명", "이수구분", "영역", "담당교원", "학점", "등급", "성적삭제명", "공학인증", "공학요소"];

export default function GradesPage() {
  const router = useRouter();
  const [name, setName] = useState<string>();
  const [studentId, setStudentId] = useState<string>();
  const [selected, setSelected] = useState(0);

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
  }, [router]);

  const isSecondStudent = studentId === "2026111767";
  const visibleRows = isSecondStudent ? [] : gradeRows;

  const summaryValue = (value: string) => isSecondStudent ? "\u00A0" : value;

  return (
    <AcademicShell name={name}>
      <div className="workspace-tabs">
        <div className="tab">공지사항조회</div>
        <div className="tab">평가항목별성적조회</div>
        <div className="tab active">전체성적조회</div>
      </div>

      <section className="grade-page">
        <div className="grade-breadcrumb">대표-학사행정 &gt; 성적 &gt; 전체성적조회</div>
        <h1>전체성적조회</h1>

        <div className="grade-toolbar">
          <strong>성적내역</strong>
          <div className="grade-action-buttons">
            <button>학생별 이수교과목 강의개요서(국/영문 교과목해설)</button>
            <button>마지막 학기 성적표</button>
            <button className="muted">선택과목평점평균조회</button>
          </div>
          <span className="grade-count">{visibleRows.length}건</span>
        </div>

        <div className="grade-table-scroll">
          <table className="grade-table">
            <thead>
              <tr>
                <th className="check-cell"><input type="checkbox" /></th>
                {headers.map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr
                  key={index}
                  className={selected === index ? "selected" : ""}
                  onClick={() => setSelected(index)}
                >
                  <td className="check-cell">
                    <input type="checkbox" checked={selected === index} readOnly />
                  </td>
                  {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grade-detail-title">성적상세 <span>−</span></div>
        <div className="grade-summary">
          <div className="summary-row">
            <b>{summaryValue("2026년도 / 1")}</b>
            <span>신청과목수</span><strong>{summaryValue("9")}</strong>
            <span>신청학점</span><strong>{summaryValue("18")}</strong>
            <span>취득학점</span><strong>{summaryValue("18")}</strong>
            <span>평점계</span><strong>{summaryValue("40.5")}</strong>
            <span>평점평균</span><strong>{summaryValue("4.5")}</strong>
            <span>증명서평점</span><strong>{summaryValue("4.5")}</strong>
            <span>학과학년석차</span><strong>{summaryValue("1/35")}</strong>
          </div>

          <div className="summary-row">
            <b>{summaryValue("전체")}</b>
            <span>총신청과목수</span><strong>{summaryValue("9")}</strong>
            <span>총신청학점</span><strong>{summaryValue("18")}</strong>
            <span>총취득학점</span><strong>{summaryValue("18")}</strong>
            <span>총평점계</span><strong>{summaryValue("40.5")}</strong>
            <span>총평점평균</span><strong>{summaryValue("4.5")}</strong>
            <span>총증명서평점</span><strong>{summaryValue("4.5")}</strong>
            <span>졸업석차백분율</span><strong>{summaryValue("2.9")}</strong>
            <span>석차</span><strong>{summaryValue("1/35")}</strong>
          </div>
        </div>
      </section>
    </AcademicShell>
  );
}
