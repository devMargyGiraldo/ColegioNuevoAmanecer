"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Paintbrush } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { themes } from "@/registry/themes";
import { useColorTheme } from "@/components/wrappers/color-theme-provider";

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  console.log("theme", theme);
  console.log("colorTheme", colorTheme);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-medium leading-none">Apariencia</h4>
          <p className="text-sm text-muted-foreground">
            Personaliza el aspecto de la aplicación. Automáticamente se ajusta
            al tema del sistema.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Paintbrush className="mr-2 h-4 w-4" />
              Temas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[200px] max-h-[calc(75svh-4rem)] overflow-y-auto"
          >
            <DropdownMenuLabel>Temas Predefinidos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
              Sistema
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Colores</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.name}
                onClick={() => setColorTheme(t.name)}
                className="flex items-center gap-2"
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: t.activeColor }}
                />
                {t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2 col-span-1 sm:col-span-3">
          <div className="space-y-2 rounded-lg border p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Vista Previa</h3>
              <p className="text-sm text-muted-foreground">
                Previsualiza cómo se verán los componentes con el tema
                seleccionado.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="w-full sm:w-auto">Botón Principal</Button>
              <Button variant="secondary" className="w-full sm:w-auto">
                Secundario
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Contorno
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto">
                Fantasma
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
