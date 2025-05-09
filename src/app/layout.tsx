import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "DAA Diffing Tool",
  description:
    "A state-of-the-art diffing tool implementing multiple algorithms with advanced features",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
