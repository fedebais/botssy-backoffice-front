const API_URL = import.meta.env.VITE_API_URL;

interface UpdateCustomerData {
  name?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  company?: string;
  position?: string;
  notes?: string;
  lastMessage?: string;
}

export async function patchCustomer(
  customerId: number,
  data: UpdateCustomerData
) {
  const response = await fetch(`${API_URL}/customer/${customerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("botssy_token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el cliente");
  }

  return await response.json();
}
