"use client";

import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function PascalSimulator() {
  const [pascalCode, setPascalCode] = useState(`Program HelloWorld(output);
begin
  writeln('Hello, world!');
end.`);
  const [compilationResult, setCompilationResult] = useState("");
  const [smOutput, setSmOutput] = useState(""); // Contenido del archivo .sm
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: pascalCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setCompilationResult(data.output);
        setSmOutput(data.sm_output); 
      } else {
        setCompilationResult(data.error || "Error desconocido");
      }
    } catch (error) {
      setCompilationResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractResult = (result: string) => {
    const lines = result.split("\n");
    const runProgramIndex = lines.findIndex((line) => line.trim() === "Run program:");
    if (runProgramIndex !== -1 && runProgramIndex + 1 < lines.length) {
      return lines[runProgramIndex + 1].trim();
    }
    return "Resultado no encontrado";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: "2rem",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#dcdcaa" }}>
          Pascal Compiler Simulator
        </h1>
        <p style={{ color: "#808080" }}>Compiladores 2024-2 | UTEC</p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#252526",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #3c3c3c",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#dcdcaa" }}>
            Código Pascal
          </h2>
          <MonacoEditor
            height="300px"
            defaultLanguage="pascal"
            value={pascalCode}
            theme="vs-dark"
            onChange={(value) => setPascalCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleRunCode}
              disabled={isLoading || !pascalCode.trim()}
              style={{
                backgroundColor: "#007acc",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "none",
                cursor: isLoading || !pascalCode.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !pascalCode.trim() ? 0.6 : 1,
                transition: "background-color 0.3s ease",
              }}
            >
              {isLoading ? "Compilando..." : "Ejecutar Código"}
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#252526",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #3c3c3c",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#dcdcaa" }}>
            Resultado Principal
          </h2>
          <div style={{ width: "100%", padding: "1rem", backgroundColor: "#1e1e1e", border: "1px solid #3c3c3c", borderRadius: "4px", color: "#d4d4d4", fontFamily: "Courier New, monospace", fontSize: "1.5rem", textAlign: "center" }}>
            {extractResult(compilationResult)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#252526",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #3c3c3c",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#dcdcaa" }}>
            Salida del Archivo SM
          </h2>
          <div style={{ width: "100%", padding: "1rem", backgroundColor: "#1e1e1e", border: "1px solid #3c3c3c", borderRadius: "4px", color: "#d4d4d4", fontFamily: "Courier New, monospace", fontSize: "1rem", overflowY: "auto", maxHeight: "200px" }}>
            <pre>{smOutput || "El archivo SM no tiene contenido."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
