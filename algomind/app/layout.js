import "./globals.css";

export const metadata = {
  title: "Cognit — AI-Powered Algorithm Learning",
  description: "Master algorithms with AI-powered analysis, interactive visualizations, complexity proofs, and personalized learning paths. Built with Google Gemini.",
  keywords: ["algorithms", "data structures", "AI", "learning", "competitive programming"],
};

export const viewport = {
  themeColor: "#27187E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
