import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dongguk nDRIMS",
  description: "과제용 학사행정정보시스템"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
