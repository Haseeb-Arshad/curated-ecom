import { useState, useEffect } from "react";
import type { MetaFunction } from "react-router";
import styles from "./test-backend.module.css";

export const meta: MetaFunction = () => [
  { title: "Backend Connectivity Test" },
  { name: "robots", content: "noindex" },
];

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  data?: any;
  error?: string;
}

function apiBase() {
  return (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
}

export default function TestBackend() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    const base = apiBase();
    setApiBaseUrl(base || null);
  }, []);

  const runTest = async (name: string, url: string, options: RequestInit = {}): Promise<TestResult> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        return {
          name,
          status: "success",
          message: `Status: ${response.status}`,
          data,
        };
      } else {
        return {
          name,
          status: "error",
          message: `Status: ${response.status}`,
          error: typeof data === "string" ? data : JSON.stringify(data),
        };
      }
    } catch (error) {
      return {
        name,
        status: "error",
        message: "Connection failed",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    const base = apiBase();
    if (!base) {
      setResults([
        {
          name: "Configuration",
          status: "error",
          message: "VITE_API_BASE_URL not configured",
          error: "Set VITE_API_BASE_URL environment variable",
        },
      ]);
      setIsRunning(false);
      return;
    }

    const tests: Array<() => Promise<TestResult>> = [
      () => runTest("Health Check", `${base}/health`),
      () => runTest("Products List", `${base}/api/products?limit=5`),
      () => runTest("Categories", `${base}/api/categories`),
      () => runTest("Brands", `${base}/api/brands`),
      () => runTest("Cart (with test ID)", `${base}/api/cart`, {
        headers: { "x-cart-id": "test-cart-123" },
      }),
      () => runTest("Reviews", `${base}/api/reviews?limit=5`),
    ];

    const testResults: TestResult[] = [];
    for (const test of tests) {
      const result = await test();
      testResults.push(result);
      setResults([...testResults]);
      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Backend Connectivity Test</h1>
        <p className={styles.description}>
          Test the connection between frontend and backend API endpoints
        </p>
      </header>

      <div className={styles.config}>
        <div className={styles.configItem}>
          <strong>API Base URL:</strong>{" "}
          {apiBaseUrl ? (
            <code className={styles.code}>{apiBaseUrl}</code>
          ) : (
            <span className={styles.error}>Not configured</span>
          )}
        </div>
        <div className={styles.configItem}>
          <strong>Frontend Origin:</strong>{" "}
          <code className={styles.code}>{window.location.origin}</code>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={runAllTests}
          disabled={isRunning || !apiBaseUrl}
          className={styles.button}
        >
          {isRunning ? "Running Tests..." : "Run Tests"}
        </button>
        {results.length > 0 && (
          <div className={styles.summary}>
            <span className={styles.summaryItem}>
              ✓ Passed: <strong>{successCount}</strong>
            </span>
            <span className={styles.summaryItem}>
              ✗ Failed: <strong>{errorCount}</strong>
            </span>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Test Results</h2>
          <ul className={styles.resultsList}>
            {results.map((result, index) => (
              <li key={index} className={styles.resultItem}>
                <div className={styles.resultHeader}>
                  <span
                    className={`${styles.statusIndicator} ${
                      result.status === "success"
                        ? styles.success
                        : result.status === "error"
                        ? styles.error
                        : styles.pending
                    }`}
                  >
                    {result.status === "success"
                      ? "✓"
                      : result.status === "error"
                      ? "✗"
                      : "○"}
                  </span>
                  <span className={styles.resultName}>{result.name}</span>
                  <span className={styles.resultMessage}>{result.message}</span>
                </div>
                {result.error && (
                  <div className={styles.errorDetails}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                {result.data && result.status === "success" && (
                  <details className={styles.dataDetails}>
                    <summary>Response Data</summary>
                    <pre className={styles.dataPreview}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!apiBaseUrl && (
        <div className={styles.warning}>
          <h3>Configuration Required</h3>
          <p>
            To test backend connectivity, set the <code>VITE_API_BASE_URL</code>{" "}
            environment variable.
          </p>
          <p>
            Example: <code>VITE_API_BASE_URL=http://localhost:8787</code>
          </p>
        </div>
      )}
    </div>
  );
}

