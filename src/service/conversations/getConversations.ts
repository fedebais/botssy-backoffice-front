const API_URL = import.meta.env.VITE_API_URL;

export async function getConversations(tenantId: number) {
  try {
    const res = await fetch(`${API_URL}/conversations/tenant/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al cargar conversaciones");
    return await res.json();
  } catch (error) {
    console.error("Error en getConversations:", error);
    return [];
  }
}
