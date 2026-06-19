"use client";

import { useAuth } from "@/context/AuthContext";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import GuestOnlyRoute from "../components/auth/GuestOnlyRoute";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username) {
      toast.error("Please give username");
      return;
    }
    if (!password) {
      toast.error("Please give password");
      return;
    }
    try {
      setLoading(true);

      const data = await login(username, password);

      localStorage.setItem("token", data.token);

      await refreshUser();

      router.push("/dashboard");
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error(error);

      const backendError =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Invalid username or password";

      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login-bg.png')",
          }}
        />

        {/* White Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />

        {/* Existing Animated Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#4F46E5]/10 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[#4F46E5]/15 blur-3xl"
        />

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative flex items-center justify-center overflow-hidden px-6">
            {" "}
            <div className="relative max-w-lg px-4 mx-auto sm:px-0">
              <div className="overflow-hidden bg-white rounded-md shadow-md">
                <div className="px-4 py-6 sm:px-8 sm:py-7">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Welcome back
                    </h2>
                    <p className="mt-2 text-base text-gray-600">
                      Don’t have one?{" "}
                      <a
                        href="/signup"
                        title=""
                        className="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700"
                      >
                        Create a free account
                      </a>
                    </p>
                  </div>

                  <form action="#" method="POST" className="mt-8">
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor=""
                          className="text-base font-medium text-gray-900"
                        >
                          {" "}
                          Username{" "}
                        </label>
                        <div className="mt-2.5">
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />{" "}
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              name=""
                              id=""
                              required
                              placeholder="Enter username"
                              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 outline-none transition-all duration-300 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor=""
                            className="text-base font-medium text-gray-900"
                          >
                            {" "}
                            Password{" "}
                          </label>

                          {/* <a
                          href="#"
                          title=""
                          className="text-sm font-medium transition-all duration-200 text-rose-500 hover:text-rose-600 focus:text-rose-600 hover:underline"
                        >
                          {" "}
                          Forgot password?{" "}
                        </a> */}
                        </div>
                        <div className="mt-2.5">
                          <div className="relative">
                            {" "}
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />{" "}
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter password"
                              required
                              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 outline-none transition-all duration-300 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"
                            />{" "}
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              {" "}
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>
                      </div>

                      <div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogin}
                          disabled={loading}
                          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                        >
                          {" "}
                          {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              {" "}
                              Sign In{" "}
                              <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />{" "}
                            </>
                          )}{" "}
                        </motion.button>{" "}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Login Card */}{" "}
          </div>
        </motion.div>
      </div>
    </GuestOnlyRoute>
  );
}
