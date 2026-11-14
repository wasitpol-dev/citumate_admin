"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginView } from "@/components/views/LoginView";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginView
      onLoginSuccess={() => {
        router.push("/");
      }}
    />
  );
}
