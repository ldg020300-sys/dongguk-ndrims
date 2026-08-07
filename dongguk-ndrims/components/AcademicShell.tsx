"use client";

import { useRouter } from "next/navigation";
import { Languages, LogOut, Menu, Network, Settings, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AcademicSidebar from "@/components/AcademicSidebar";

export default function AcademicShell({ children, name }: { children: React.ReactNode; name?: string }) {
  const router = useRouter();
  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <div className="academic-app">
      <header className="academic-topbar">
        <div className="academic-brand">동국대학교<br /><span>학사행정정보시스템</span></div>
        <div className="academic-topmenus">
          <span>대표-학사행정</span>
          <span>대표-행정정보</span>
          <span>대표-산단행정</span>
        </div>
        <div className="academic-user">
          <span>{name ? `${name} 학생` : "학생"}</span>
          <button><Languages size={18} /></button>
          <button><UserRound size={18} /></button>
          <button><Network size={18} /></button>
          <button><Settings size={18} /></button>
          <button className="logout" onClick={logout}><LogOut size={18} /></button>
        </div>
      </header>
      <div className="academic-body">
        <AcademicSidebar />
        <main className="academic-content">{children}</main>
      </div>
    </div>
  );
}
