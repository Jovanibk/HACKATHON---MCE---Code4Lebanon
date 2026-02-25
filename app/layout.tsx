import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "NUMU National Monitoring & Analytics Dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-7xl space-y-4 px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
