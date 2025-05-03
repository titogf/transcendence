import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Recuperar sesión guardada en localStorage (si existe)
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // si usas cookies
        body: JSON.stringify({ username, password }),
      });
  
      console.log("Response status:", response.status); // 👈 Añade esto
  
      if (response.ok) {
        const data = await response.json();
      
        const userData = {
          username: data.username,
          name: data.name,
          email: data.email,
          token: data.token || "", // si tienes token
        };
      
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      
        return true;
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Error en login:", error);
        return false;
      }
    } catch (error) {
      console.error("Error durante login:", error);
      return false;
    }
  };  
  
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
