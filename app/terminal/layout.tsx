import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dubuntu",
  description: "Dubuntu Terminal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
