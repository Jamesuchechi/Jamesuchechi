import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Okpara James Uchechi | Full-Stack Developer Portfolio",
  description: "Okpara James Uchechi (James Uchechi) is a full-stack software engineer building hackathon-winning web apps, AI-powered experiences, and high-performance digital products.",
  keywords: [
    "James Uchechi",
    "Okpara James Uchechi",
    "jamesuchechi",
    "jamesuchechi6",
    "full-stack developer",
    "software engineer",
    "hackathons",
    "AI web applications",
    "portfolio",
    "developer profile"
  ],
  metadataBase: new URL('https://vercel.app'),
  alternates: {
    canonical: 'https://vercel.app',
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Okpara James Uchechi | Full-Stack Developer Portfolio",
    description: "Portfolio of Okpara James Uchechi — software engineering, hackathon projects, AI web apps, and full-stack development expertise.",
    url: "https://vercel.app",
    siteName: "Okpara James Uchechi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okpara James Uchechi | Full-Stack Developer Portfolio",
    description: "Discover the portfolio of Okpara James Uchechi, a full-stack engineer focused on AI web applications, hackathons, and production-ready software.",
    creator: "@jamesuchechi6",
    site: "@jamesuchechi6",
  },
};

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Okpara James Uchechi",
  alternateName: "James Uchechi",
  url: "https://vercel.app",
  jobTitle: "Full Stack Developer",
  description: "Okpara James Uchechi is a full-stack software engineer building hackathon-winning and AI-enabled web applications.",
  sameAs: [
    "https://www.linkedin.com/in/james-okpara-434a29332",
    "https://github.com/jamesuchechi",
    "https://devpost.com/okparajamesuchechi",
    "https://x.com/jamesuchechi6",
    "https://facebook.com/jamesuchechi6"
  ]
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {children}
      </body>
    </html>
  );
}
