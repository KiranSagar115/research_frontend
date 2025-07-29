import { useState } from "react";
import { runMultiAgent } from "../api";
import jsPDF from "jspdf";

export default function AgentRunner() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await runMultiAgent(goal);

      // Optional: Remove planning section if needed
      const cleaned = res.replace(/^PLAN:.*?\n(\d+\..*?\n)+/is, "").trim();
      setResult(cleaned);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 20);
    doc.save("result.pdf");
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Execution</h1>

        <textarea
          className="w-full border border-gray-300 rounded p-3"
          rows={5}
          placeholder="Enter your task goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            disabled={!goal || loading}
          >
            {loading ? "Running..." : "Run"}
          </button>

          {result && (
            <button
              onClick={handleExportPDF}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Export as PDF
            </button>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="border border-gray-300 rounded p-4 text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
