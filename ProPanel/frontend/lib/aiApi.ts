// frontend/lib/aiApi.ts
export async function askAIForHelp(question: string) {
  const res = await fetch("/api/plugins/exec?name=aiassist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  const data = await res.json();
  return data.answer;
}
