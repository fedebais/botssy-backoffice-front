const API_URL = import.meta.env.VITE_API_URL;

export async function getTotalOperators(tenantId: number) {
  try {
    const res = await fetch(
      `${API_URL}/conversations/totalOperator/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Error al cargar la cantidad de operadores");

    const data = await res.json();
    return data.total;
  } catch (error) {
    console.error("Error en getTotalOperators:", error);
    return 0;
  }
}
