const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCustomer(tenantId: number) {
  try {
    const res = await fetch(`${API_URL}/customer/tenant/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al obtener los contactos");
    return await res.json();
  } catch (error) {
    console.error("Error en getAllCustomer:", error);
    return [];
  }
}
