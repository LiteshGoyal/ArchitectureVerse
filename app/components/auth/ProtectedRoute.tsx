"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import DashboardSkeleton from "../DashboardSkelton";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login first");
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <DashboardSkeleton />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
