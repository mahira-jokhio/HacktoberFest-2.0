import { useEffect, useState } from "react";
import axios from "../utils/axios";

export function useAuthUser() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Only fetch if not already present
    if (!user && localStorage.getItem("token")) {
      axios.get("/api/auth/me", { withCredentials: true })
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        });
    }
  }, []);

  // Logout helper
  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, logout };
}