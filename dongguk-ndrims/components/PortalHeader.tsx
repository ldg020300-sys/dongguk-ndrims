"use client";

import { useRouter } from "next/navigation";
import { Menu, Languages, Settings, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PortalHeader({ name }: { name?: string }) {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <header className="portal-header">
      <div className="container portal-header-inner">
        <button className="nav-btn" aria-label="메뉴"><Menu size={22} /></button>
        <div className="brand">동국대학교 학사행정정보시스템</div>
        {name && <span className="hide-mobile">{name} 학생</span>}
        <button className="nav-btn hide-mobile" aria-label="언어"><Languages size={20} /></button>
        <button className="nav-btn hide-mobile" aria-label="마이페이지" onClick={() => router.push("/mypage")}><UserRound size={20} /></button>
        <button className="nav-btn hide-mobile" aria-label="설정"><Settings size={20} /></button>
        <button className="nav-btn orange" aria-label="로그아웃" onClick={logout}><LogOut size={20} /></button>
      </div>
    </header>
  );
}
