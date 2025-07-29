function getInitials(name: string): string {
  if (!name) return "";

  // 1. Eliminar emojis y caracteres que no sean letras o espacio
  const clean = name
    .replace(/[^\p{L}\s]/gu, "") // solo letras unicode y espacios
    .trim();

  if (!clean) return "";

  // 2. Separar en palabras
  const parts = clean.split(" ").filter(Boolean);

  // 3. Obtener iniciales
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  } else {
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }
}

export default getInitials;
