"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Calendar,
  Book,
  Award,
  Pencil,
  Trash2,
  Plus,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  createTeacher,
  deleteTeacher,
  updateStudent,
  updateTeacher,
} from "@/actions";
import { toast } from "sonner";

export default function TeacherPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState<SubjectType[] | null>(null);
  const [teachers, setTeachers] = useState<TeacherType[] | null>(null);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherType | null>(
    null,
  );

  const [newTeacher, setNewTeacher] = useState<Omit<TeacherType, "teacherId">>({
    document: "",
    name: "",
    dateOfBirth: "",
    specialty: "",
    subjectId: 1,
  });

  const filteredTeachers = teachers?.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.document.toString().includes(searchTerm.toString()),
  );

  // Fetch teachers and subjects when component loads
  const fetchTeachers = async () => {
    const response = await fetch("http://localhost:3000/api/teachers", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
    setTeachers(data);
  };

  const fetchSubjects = async () => {
    const response = await fetch("http://localhost:3000/api/subjects");
    const data = await response.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, [isAddingTeacher]);

  const handleAddTeacher = () => {
    if (
      !newTeacher.document ||
      !newTeacher.name ||
      !newTeacher.dateOfBirth ||
      !newTeacher.specialty ||
      !newTeacher.subjectId
    ) {
      toast.error("Por favor, rellena todos los campos");
      return;
    }

    createTeacher(newTeacher).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    setIsAddingTeacher(false);
    fetchTeachers();
  };

  const handleEditTeacher = (teacher: TeacherType) => {
    setEditingTeacher({ ...teacher });
  };

  const handleSaveEdit = () => {
    if (editingTeacher) {
      console.log(editingTeacher);

      updateTeacher(editingTeacher).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);

          setTeachers(
            teachers?.map((teacher) =>
              teacher.teacherId === editingTeacher.teacherId
                ? editingTeacher
                : teacher,
            ) || null,
          );
        }
      });
    }
    setIsEditingTeacher(false);
  };

  const handleDeleteTeacher = (id: number) => {
    console.log(id);

    deleteTeacher(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setTeachers(
          teachers?.filter((teacher) => teacher.teacherId !== id) || null,
        );
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Expedientes de Profesores</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profesor"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Profesor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Profesor</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo profesor aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-document" className="text-right">
                  Documento de Identidad
                </Label>
                <Input
                  id="new-document"
                  value={newTeacher.document}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, document: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="new-name"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-birthdate" className="text-right">
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="new-birthdate"
                  type="date"
                  value={newTeacher.dateOfBirth}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      dateOfBirth: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-specialty" className="text-right">
                  Especialidad
                </Label>
                <Input
                  id="new-specialty"
                  value={newTeacher.specialty}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, specialty: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-subject" className="text-right">
                  Asignatura
                </Label>
                <Select
                  value={newTeacher.subjectId.toString()}
                  onValueChange={(value) =>
                    setNewTeacher({ ...newTeacher, subjectId: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar asignatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem
                        key={subject.subjectId}
                        value={subject.subjectId.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTeacher}>Agregar Profesor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
          <CardDescription>
            Gestiona los expedientes de los profesores de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Especialidad
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  Asignatura
                </TableHead>
                <TableHead className="hidden sm:table-cell text-right pr-12">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers &&
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.teacherId}>
                    <TableCell className="sm:hidden">
                      <div className="font-medium">{teacher.name}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {teacher.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {teacher.specialty}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {
                        subjects?.find(
                          (subject) => subject.subjectId === teacher.subjectId,
                        )?.name
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Expediente de {teacher.name}
                              </DialogTitle>
                              <DialogDescription>
                                Detalles del expediente del profesor
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Avatar className="w-20 h-20">
                                  <AvatarImage src={``} />
                                  <AvatarFallback>
                                    {teacher.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left">
                                  <h3 className="font-semibold text-lg">
                                    {teacher.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Documento: {teacher.document}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>Especialidad: {teacher.specialty}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Fecha de Nacimiento: {teacher.dateOfBirth}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Book className="h-4 w-4" />
                                  <span>
                                    Asignatura:{" "}
                                    {
                                      subjects?.find(
                                        (subject) =>
                                          subject.subjectId ===
                                          teacher.subjectId,
                                      )?.name
                                    }
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Logros</h4>
                                <div className="flex gap-2">
                                  <Badge variant="secondary">
                                    <Award className="h-3 w-3 mr-1" />
                                    Profesor del Año
                                  </Badge>
                                  <Badge variant="secondary">
                                    <Award className="h-3 w-3 mr-1" />
                                    Excelencia Académica
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isEditingTeacher}
                          onOpenChange={setIsEditingTeacher}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditTeacher(teacher)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Profesor</DialogTitle>
                              <DialogDescription>
                                Modifica la información del profesor aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="document"
                                  className="text-right"
                                >
                                  Documento de Identidad
                                </Label>
                                <Input
                                  id="document"
                                  value={editingTeacher?.document}
                                  onChange={(e) => {
                                    if (editingTeacher) {
                                      setEditingTeacher({
                                        ...editingTeacher,
                                        document: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="name"
                                  value={editingTeacher?.name}
                                  onChange={(e) => {
                                    if (editingTeacher) {
                                      setEditingTeacher({
                                        ...editingTeacher,
                                        name: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="specialty"
                                  className="text-right"
                                >
                                  Especialidad
                                </Label>
                                <Input
                                  id="specialty"
                                  value={editingTeacher?.specialty}
                                  onChange={(e) => {
                                    if (editingTeacher) {
                                      setEditingTeacher({
                                        ...editingTeacher,
                                        specialty: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subject" className="text-right">
                                  Asignatura
                                </Label>
                                <Select
                                  value={editingTeacher?.subjectId.toString()}
                                  onValueChange={(e) => {
                                    if (editingTeacher) {
                                      setEditingTeacher({
                                        ...editingTeacher,
                                        subjectId: parseInt(e),
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar asignatura" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subjects?.map((subject) => (
                                      <SelectItem
                                        key={subject.subjectId}
                                        value={subject.subjectId.toString()}
                                      >
                                        {subject.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="dateOfBirth"
                                  className="text-right"
                                >
                                  Fecha de Nacimiento
                                </Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  value={editingTeacher?.dateOfBirth}
                                  onChange={(e) => {
                                    if (editingTeacher) {
                                      setEditingTeacher({
                                        ...editingTeacher,
                                        dateOfBirth: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSaveEdit}>
                                Guardar cambios
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Estás absolutamente seguro?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará
                                permanentemente el expediente del profesor y lo
                                removerá de nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteTeacher(teacher.teacherId)
                                }
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
