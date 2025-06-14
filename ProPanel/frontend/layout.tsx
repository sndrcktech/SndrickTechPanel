// frontend/layout.tsx
import "reactflow/dist/style.css";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-slate-100">
        <nav className="p-4 shadow bg-white sticky top-0 flex gap-4">
          <a href="/topology" className="font-bold">SandrickTechPanel</a>
          <a href="/policy">Политики</a>
          <a href="/aiassist">AI‑ассистент</a>
          <a href="/reports">Отчёты</a>
          <a href="/wizard/add-server">Добавить сервер</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
