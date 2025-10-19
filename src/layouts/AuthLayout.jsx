import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "next-themes";
import ThemeToggle from "@/inc/theme/ThemeToggle"; // 👈 importa tu botón

const AuthLayout = () => {
  const { resolvedTheme } = useTheme();
  const bgUrl =
    resolvedTheme === "dark"
      ? "/assets/auth-bg-black.webp"
      : "/assets/auth-bg.webp";

  return (
    <>
      {/* Fondo dinámico según tema */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-bottom bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${bgUrl}')`,
          backgroundPosition: "center bottom",
        }}
      />

      {/* Botón de cambio de tema (esquina superior derecha) */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Contenido de las páginas de auth */}
      <Outlet />

      <footer className="pointer-events-none fixed right-4 bottom-3 text-[11px] sm:text-xs text-muted-foreground/90">
        © Marketplace Link. Derechos reservados
      </footer>
    </>
  );
};

export default AuthLayout;
