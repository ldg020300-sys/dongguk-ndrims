"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AcademicShell from "@/components/AcademicShell";
import { supabase } from "@/lib/supabase";

const rows = [
  ["성별", "남", "성적번호", "-", "법명", "", "불교동아리명", ""],
  ["총등록/총이수/총휴학", "1/1/0", "전체이수학기수", "1", "재입학년도학기", "-", "재입학일자", ""],
  ["분교/본교", "본교생", "정원내외", "정원내", "한국계여부", "", "광역학구분", ""],
  ["교직대상", "", "증명발급중지대상", "", "전과제외여부", "", "소속캠퍼스", "서울"],
  ["예비군편성여부", "미편성자", "공학인증심화대상", "", "선수대상", "", "TOPIK취득일자", ""],
  ["TOPIK등급(입학)", "", "TOPIK취득일자(졸업)", "", "TOPIK등급(졸업)", "", "학석사연계과정", ""],
  ["학석박사연계과정", "", "영어레벨테스트", "L5", "가진급(수강신청학년)", "1", "", ""],
];

export default function StudentRecordPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    })();
  }, [router]);

  return (
    <AcademicShell name={profile?.name}>
      <div className="workspace-tabs"><div className="tab">공지사항조회</div><div className="tab active">학적부열람</div></div>
      <section className="student-record-page">
        <h1>학적부열람</h1>
        <div className="record-section-title">학생기초정보</div>
        <div className="identity-grid">
          <img src="/profile.png" alt="학생 프로필" className="profile-photo" />
          <div className="identity-table">
            <div className="cell label">학번/성명</div><div className="cell">{profile?.student_id ?? "2026110431"}/{profile?.name ?? "임동균"}</div>
            <div className="cell label">성명(영문)</div><div className="cell">LIM DONGGYUN</div>
            <div className="cell label">생년월일</div><div className="cell">2003-02-03(남)</div>
            <div className="cell label">핸드폰</div><div className="cell">010-8910-6356</div>
            <div className="cell label">학생구분</div><div className="cell">본교생(학생)</div>
            <div className="cell label">학위과정</div><div className="cell">학사과정　1학년 | 가진급 1학년</div>
            <div className="cell label">학과전공</div><div className="cell">{profile?.major ?? "약학과"}</div>
            <div className="cell label">입학구분</div><div className="cell">2026-03-01(신입학)</div>
            <div className="cell label">학적상태</div><div className="cell">재학/신입학(2026-03-01)</div>
            <div className="cell label">국적</div><div className="cell">대한민국</div>
            <div className="cell label">교육과정년도</div><div className="cell">2026</div>
            <div className="cell label">등록/이수/휴학</div><div className="cell">1/1/0</div>
          </div>
        </div>

        <div className="record-tabs">
          {['기본','학적변동','입학','전공/교직','수강','성적','장학','등록','교류/현장','사회봉사','기재사항','상벌','지도교수','졸업(학부)'].map((t, i) => <button key={t} className={i === 0 ? 'active' : ''}>{t}</button>)}
        </div>

        <div className="record-section-title">기본정보</div>
        <div className="record-table">
          {rows.flatMap((row, idx) => row.map((value, i) => <div key={`${idx}-${i}`} className={i % 2 === 0 ? 'record-label' : 'record-value'}>{value}</div>))}
        </div>

        <div className="record-section-title">신상정보</div>
        <div className="record-table personal">
          <div className="record-label">주민등록번호</div><div className="record-value">030203-*******</div>
          <div className="record-label">전화번호</div><div className="record-value">-</div>
          <div className="record-label">핸드폰</div><div className="record-value">010-8910-6356</div>
          <div className="record-label">Email</div><div className="record-value">ldg0610@naver.com</div>
          <div className="record-label">거주지주소</div><div className="record-value span-7">서울특별시 중랑구 중랑역로 124 1401호(중화동, 삼익아파트)</div>
          <div className="record-label">예금주명</div><div className="record-value">임동균</div>
          <div className="record-label">은행명</div><div className="record-value">토스뱅크</div>
          <div className="record-label">계좌번호</div><div className="record-value span-3">100091146325</div>
        </div>
      </section>
    </AcademicShell>
  );
}
