import * as React from "react";
import { GraduationCap, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/shared/dashboard-card";

export default function Page() {
  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Total Estudiantes" value="1,234" />
            <DashboardCard title="Total Profesores" value="56" />
            <DashboardCard title="Promedio General" value="8.7" />
            <DashboardCard title="Asistencia" value="95%" />
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button className="h-auto py-4 flex flex-col items-center justify-center">
                <GraduationCap className="h-6 w-6 mb-2" />
                <span>Agregar Estudiante</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Agregar Profesor</span>
              </Button>
              <Button
                className="h-auto py-4 flex flex-col items-center justify-center"
                variant="secondary"
              >
                <ClipboardList className="h-6 w-6 mb-2" />
                <span>Ingresar Calificaciones</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}