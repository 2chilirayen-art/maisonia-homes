import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/maisonia/index.html");
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <a href="/maisonia/index.html" className="text-primary underline">
        Open Maisonia
      </a>
    </div>
  );
}
