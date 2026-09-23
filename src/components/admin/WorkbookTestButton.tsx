"use client";

import { useState } from "react";

export function WorkbookTestButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function testConnection() {
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/workbook/test", {
        method: "POST",
      });
      const data = (await response.json()) as { message?: string; ok?: boolean; reason?: string };
      setMessage(`${data.ok ? "Success" : "Needs attention"}: ${data.message ?? "No response."}`);
    } catch {
      setMessage("Needs attention: the test request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={testConnection}
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-white px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85 disabled:opacity-60"
      >
        {pending ? "Testing..." : "Test Connection"}
      </button>
      {message ? <p className="mt-3 text-xl font-normal leading-tight">{message}</p> : null}
    </div>
  );
}
