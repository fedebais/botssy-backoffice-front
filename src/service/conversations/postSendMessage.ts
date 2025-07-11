export const API_URL = "http://localhost:3000";

export async function postSendMessage({
  userPhone,
  channel,
  agentId,
  role,
  content,
  conversationId,
  operatorId,
}: {
  userPhone: string;
  channel: string;
  agentId: number;
  role: "user" | "assistant" | "operator" | "system";
  content: string;
  operatorId?: number;
  conversationId?: number;
}) {
  try {
    const res = await fetch(`${API_URL}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPhone,
        channel,
        agentId,
        role,
        content,
        conversationId,
        operatorId,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || "Error al enviar mensaje");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en sendMessage:", error);
    return null;
  }
}
