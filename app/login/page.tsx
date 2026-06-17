"use client";

import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { refreshUser } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await login(username, password);

      localStorage.setItem("token", data.token);
      await refreshUser();
      console.log("logged In");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
