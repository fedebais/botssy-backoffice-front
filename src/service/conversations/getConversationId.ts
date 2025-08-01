const API_URL = import.meta.env.VITE_API_URL;

export async function getConversationId(
  conversationId: number,
  page = 1,
  limit = 20
) {
  try {
    const res = await fetch(
      `${API_URL}/conversations/${conversationId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Error al cargar conversación");
    return await res.json();
  } catch (error) {
    console.error("Error en getConversationId:", error);
    return null;
  }
}
