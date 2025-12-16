import "./globals.css";

export const metadata = {
  title: "Kokua Prototype",
  description: "A personalized wellness journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
