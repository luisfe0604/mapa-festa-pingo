export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://simulados-oab-back.onrender.com";

export const WS_URL = API_BASE_URL.replace(/^http/, "ws");
