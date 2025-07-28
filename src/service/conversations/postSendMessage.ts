export const API_URL = "http://localhost:3000";

export async function postSendMessage({
  userPhone,
  channel,
  role,
  content,
  conversationId,
  operatorId,
  tenantId,
  botId,
}: {
  userPhone: string;
  channel: string;
  botId: number;
  role: "user" | "assistant" | "operator" | "system";
  content: string;
  operatorId?: number;
  conversationId?: number;
  tenantId: number;
}) {
  try {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPhone,
        channel,
        botId,
        role,
        content,
        conversationId,
        operatorId,
        tenantId,
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
