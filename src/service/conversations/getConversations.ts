export const API_URL = "http://localhost:3000";

export async function getConversations() {
  try {
    const res = await fetch(`${API_URL}/api/conversations`);
    if (!res.ok) throw new Error("Error al cargar conversaciones");
    return await res.json();
  } catch (error) {
    console.error("Error en getConversations:", error);
    return [];
  }
}
