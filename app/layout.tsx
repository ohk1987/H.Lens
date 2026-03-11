import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import AchievementToast from "@/components/ui/AchievementToast";

export const metadata: Metadata = {
  title: "H.Lens - 헤드헌터 리뷰 플랫폼",
  description: "신뢰할 수 있는 헤드헌터를 찾아보세요. 실제 경험 기반 리뷰와 평점을 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AchievementToast />
        </AuthProvider>
      </body>
    </html>
  );
}
