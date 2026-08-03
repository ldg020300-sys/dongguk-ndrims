"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import { supabase } from "@/lib/supabase";

export default function MyPage() {
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
    <>
      <PortalHeader name={profile?.name} />
      <main className="container" style={{ padding: "30px 0" }}>
        <h1 className="page-title">마이페이지</h1>
        <section className="card" style={{ padding: 24 }}>
          <div className="panel-title">내 정보</div>
          <div className="grid">
            <div><b>이름</b><p>{profile?.name}</p></div>
            <div><b>학번</b><p>{profile?.student_id}</p></div>
            <div><b>학과</b><p>{profile?.major}</p></div>
            <div><b>학년</b><p>{profile?.year}학년</p></div>
          </div>
          <button className="btn btn-secondary" onClick={() => router.push("/dashboard")}>메인으로 돌아가기</button>
        </section>
      </main>
    </>
  );
}
