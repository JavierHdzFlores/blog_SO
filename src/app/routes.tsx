import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { LinuxIntro } from "./pages/LinuxIntro";
import { Processes } from "./pages/Processes";
import { IPC } from "./pages/IPC";
import { About } from "./pages/About";
import { MiniShell } from "./pages/MiniShell";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="text-6xl">🔍</span>
      <h1 style={{ fontFamily: "'Inter', sans-serif" }}>Página no encontrada</h1>
      <a href="/" className="text-primary underline" style={{ fontFamily: "'Inter', sans-serif" }}>
        Volver al inicio
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "linux", Component: LinuxIntro },
      { path: "procesos", Component: Processes },
      { path: "ipc", Component: IPC },
      { path: "acerca", Component: About },
      {path: "minishell", Component: MiniShell},
      { path: "*", Component: NotFound },
    ],
  },
]);
