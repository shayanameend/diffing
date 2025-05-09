import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "Diffing Next App",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
