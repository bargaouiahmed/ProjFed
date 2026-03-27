import { Link } from "@tanstack/react-router";
import ThemeToggler from "./ThemeToggler";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function ErrorComponent() {
  const { theme } = useTheme();
  return (
    <main
      className={cn(
        "bg-light-grain dark:bg-grain  min-h-screen flex items-center justify-center",
        theme == "dark" ? "bg-grain" : "bg-light-grain",
      )}
    >
      <div className="absolute top-10 left-10">
        <ThemeToggler />
      </div>
      <div className="text-center px-6 py-16 max-w-lg">
        <h1 className="text-9xl font-bold text-red-500 glitch mb-4">404</h1>

        <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full"></div>

        <h2 className="text-2xl font-bold mb-3 tracking-wide text-red-300">
          Page Not Found
        </h2>

        <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block text-white bg-red-600 hover:bg-red-600/60 text-sm font-bold px-8 py-3 rounded-full transition-colors duration-200"
        >
          ← Go Back Home
        </Link>
      </div>
    </main>
  );
}
