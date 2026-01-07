import type { Metadata } from "next";
import { Inter, Poppins, Montserrat, Raleway, Work_Sans, DM_Sans, Plus_Jakarta_Sans, Space_Grotesk, Outfit, Manrope } from "next/font/google";
import "./globals.css";

// Modern Sans-Serif Fonts for App Screenshots
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-work-sans",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Combined font classes
const fontVariables = [
  inter.variable,
  poppins.variable,
  montserrat.variable,
  raleway.variable,
  workSans.variable,
  dmSans.variable,
  plusJakartaSans.variable,
  spaceGrotesk.variable,
  outfit.variable,
  manrope.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Screenshot Studio - App Store Screenshot Generator",
  description: "Create professional App Store screenshots with templates, device frames, and localization support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVariables} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
