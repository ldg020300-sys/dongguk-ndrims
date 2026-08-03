"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PortalHeader from "@/components/PortalHeader";
import { supabase } from "@/lib/supabase";

export default function NoticeDetail() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/");
      const { data } = await supabase.from("notices").select("*").eq("id", params.id).single();
      setNotice(data);
    })();
  }, [params.id, router]);

  return (
    <>
      <PortalHeader />
      <main className="container" style={{ padding: "30px 0" }}>
        <section className="card" style={{ padding: 26 }}>
          <h1>{notice?.title ?? "공지사항"}</h1>
          <p style={{ color: "#777" }}>{notice && new Date(notice.created_at).toLocaleString("ko-KR")}</p>
          <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{notice?.content}</div>
          <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => router.push("/dashboard")}>목록으로</button>
        </section>
      </main>
    </>
  );
}
