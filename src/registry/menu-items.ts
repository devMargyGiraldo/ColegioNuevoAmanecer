import {
  ClipboardList,
  FileText,
  GraduationCap,
  Settings2,
  Users,
  Book,
  CircleFadingArrowUp,
} from "lucide-react";

export const menuItems = [
  {
    title: "Estudiantes",
    url: "/estudiantes",
    icon: GraduationCap,
    isActive: true,
  },
  {
    title: "Profesores",
    url: "/profesores",
    icon: Users,
    isActive: true,
  },

  { title: "Asignaturas", url: "/asignaturas", icon: Book, isActive: true },
  {
    title: "Grados",
    url: "/grados",
    icon: CircleFadingArrowUp,
    isActive: true,
  },
  {
    title: "Calificaciones",
    url: "/calificaciones",
    icon: ClipboardList,
    items: [
      {
        title: "Periodos Academicos",
        url: "/calificaciones/periodos",
      },
      {
        title: "Logros",
        url: "/calificaciones/logros",
      },
    ],
  },
  {
    title: "Informes",
    url: "#",
    icon: FileText,
    items: [
      {
        title: "General Informes",
        url: "#",
      },
      {
        title: "Historico de Informes",
        url: "#",
      },
    ],
  },
  {
    title: "Configuracion",
    url: "/configuracion",
    icon: Settings2,
  },
];
