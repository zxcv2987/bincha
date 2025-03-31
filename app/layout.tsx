import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ModalStoreProvider } from "@/utils/providers/ModalProvider";
import { CategoryStoreProvider } from "@/utils/providers/CategoryProvider";
import StoreProvider from "@/utils/providers/Providers";

const LINESeedKr = localFont({
  src: [
    {
      path: "../public/fonts/LINESeedKR-Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedKR-Th.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedKR-Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "빈차",
  description: "내가 해야 할 일",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${LINESeedKr.className} antialiased`}>
        <main className="mx-auto flex max-w-4xl px-4 py-20">
          <StoreProvider>{children}</StoreProvider>
        </main>
      </body>
    </html>
  );
}
