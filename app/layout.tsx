import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will you be my Valentine?",
  description: "Create and share your Valentine's Day interactive templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
