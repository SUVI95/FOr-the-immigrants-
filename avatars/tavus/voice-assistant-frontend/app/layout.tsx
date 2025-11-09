import "@livekit/components-styles";
import { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";
import { TranslationProvider } from "@/components/i18n/TranslationProvider";
import { UserProfileProvider } from "@/context/UserProfileContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Knuut AI – Civic Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${poppins.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full">
        <UserProfileProvider>
        <TranslationProvider>
          <GlobalHeader />
          <div style={{ paddingTop: 72 }}>{children}</div>
        </TranslationProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
}
