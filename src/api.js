
// src/api.js
export async function runMultiAgent(goal) {
    const response = await fetch("http://localhost:8000/run-multi-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to run multi-agent");
    }
  
    const data = await response.json();
    return data.result;
  }
  