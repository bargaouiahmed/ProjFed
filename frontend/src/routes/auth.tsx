import SignIn from "@/components/auth/signIn/signIn";
import SignUp from "@/components/auth/signUp/signUp";
import ThemeToggler from "@/components/ThemeToggler";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import bg from "@/assets/bg.png";
export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const [authTab, setAuthTab] = useState("signIn");
  function goToSignUp() {
    setAuthTab("signUp");
  }
  function goToSignIn() {
    setAuthTab("signIn");
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background">
      <div className="absolute top-4 left-4 z-90">
        <ThemeToggler />
      </div>
      {authTab === "signIn" ? (
        <SignIn goToSignUp={goToSignUp} />
      ) : (
        <SignUp goToSignIn={goToSignIn} />
      )}
      <section className="hidden md:block md:basis-5/12 lg:basis-7/12 bg-red-500">
        <img src={bg} className="h-full w-full block bg-cover" />
      </section>
    </div>
  );
}
