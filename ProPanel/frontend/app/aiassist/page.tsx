// frontend/app/aiassist/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { askAIForHelp } from "@/lib/aiApi";

export default function AiAssistPage() {
  const [question, setQuestion] = useState(""), [answer, setAnswer] = useState("");
  async function getAnswer() { setAnswer("Генерируем ответ..."); setAnswer(await askAIForHelp(question)); }
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl mb-6">AI‑ассистент</h1>
      <input className="border p-2 rounded w-full" placeholder="Ваш вопрос" value={question} onChange={e => setQuestion(e.target.value)} />
      <Button className="mt-4" onClick={getAnswer}>Спросить AI</Button>
      {answer && <div className="mt-4 p-2 bg-gray-100 rounded">{answer}</div>}
    </div>
  );
}
