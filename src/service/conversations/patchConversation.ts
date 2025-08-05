const API_URL = import.meta.env.VITE_API_URL;

interface UpdateCustomerData {
  operatorId?: number | null;
  requestOperator?: boolean;
}

export async function patchConversation(
  conversationId: number,
  data: UpdateCustomerData
) {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar la conversacion");
  }

  return await response.json();
}
