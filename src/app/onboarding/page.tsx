"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OnboardingWelcome from "@/components/OnboardingWelcome";

export default function OnboardingPage() {
  const router = useRouter();
  return (
    <OnboardingWelcome
      onStart={() => router.push("/sign-in")}
      heading="Event planning made easy"
      description="Choose event type, location, guests, budget  get personalized suggestions for a memorable event..."
      buttonLabel="Start"
    />
  );
}


