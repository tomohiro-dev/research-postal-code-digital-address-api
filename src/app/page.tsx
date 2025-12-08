"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/search?code=${code}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          郵便番号・デジタルアドレスAPI検索
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">郵便番号・デジタルアドレスAPI検索(7桁)</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="1000001"
                className="p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={7}
              />
            </label>

            <button
              type="submit"
              disabled={loading || code.length !== 7}
              className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded border border-red-200 break-all">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {result && (
          <div className="mt-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Search Result</h2>
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-inner overflow-x-auto">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}