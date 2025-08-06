const API_URL = import.meta.env.VITE_API_URL;

interface UpdateAgentData {
  name?: string;
  description?: string;
  prompt: string;
  promptExtension?: string;
}

export async function patchAgent(agentId: number, data: UpdateAgentData) {
  const response = await fetch(`${API_URL}/agent/${agentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el agente");
  }

  return await response.json();
}
