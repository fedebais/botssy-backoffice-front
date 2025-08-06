const API_URL = import.meta.env.VITE_API_URL;

export async function deleteConversation(conversationId: number) {
  try {
    const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al eliminar la conversación");
    return await res.json();
  } catch (error) {
    console.error("Error en deleteConversation:", error);
    throw error;
  }
}
