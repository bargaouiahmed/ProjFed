import SignIn from "@/components/auth/signIn/signIn";
import SignUp from "@/components/auth/signUp/signUp";
import ThemeToggler from "@/components/ThemeToggler";

import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Shapes from "../components/shapes.jsx";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const [authTab, setAuthTab] = useState("signIn");
  function goToSignUp() {
    setAuthTab("signUp");
  }
  function goToSignIn() {
    setAuthTab("signIn");
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background ">
      <div className="absolute top-4 left-4 z-90">
        <ThemeToggler />
      </div>
      {authTab === "signIn" ? (
        <SignIn goToSignUp={goToSignUp} />
      ) : (
        <SignUp goToSignIn={goToSignIn} />
      )}
      <section
        className={cn(
          "hidden md:block md:basis-5/12 lg:basis-7/12 overflow-hidden  ",
          theme === "dark" ? "bg-grain" : "bg-light-grain",
        )}
      >
        <Shapes />
      </section>
    </div>
  );
}
