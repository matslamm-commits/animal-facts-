export const metadata = {
  title: "Animal Facts Chatbot",
  description: "Ask about any animal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafafa" }}>{children}</body>
    </html>
  );
}
