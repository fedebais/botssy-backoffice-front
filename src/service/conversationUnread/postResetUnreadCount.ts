const API_URL = import.meta.env.VITE_API_URL;

export async function postResetUnreadCount(conversationId: number) {
  const response = await fetch(
    `${API_URL}/conversation-unread/${conversationId}/reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo resetear el contador de no leídos");
  }

  return response.json();
}
