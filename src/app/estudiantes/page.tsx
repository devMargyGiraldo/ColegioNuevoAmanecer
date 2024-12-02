"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Calendar,
  Book,
  Pencil,
  Trash2,
  Plus,
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
import { createStudent, deleteStudent, updateStudent } from "@/actions";
import { toast } from "sonner";

export default function StudentPage({}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState<GradeType[] | null>(null);
  const [students, setStudents] = useState<StudentType[] | null>(null);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentType | null>(
    null,
  );

  const [newStudent, setNewStudent] = useState<Omit<StudentType, "studentId">>({
    document: "",
    name: "",
    dateOfBirth: "",
    gradeId: 1,
  });

  const filteredStudents = students?.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.document.toString().includes(searchTerm.toString()),
  );

  // Obtener estudiantes y grados al cargar el componente
  // Función para obtener los estudiantes desde la API
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/students");
      if (!response.ok) {
        throw new Error("Error al obtener los estudiantes");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos");
    }
  };

  // Función para obtener los grados desde la API
  const fetchGrades = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/grades");
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const handleAddStudent = async () => {
    if (
      !newStudent.document ||
      !newStudent.name ||
      !newStudent.dateOfBirth ||
      !newStudent.gradeId
    ) {
      toast.error("Por favor, rellena todos los campos");
      return;
    }

    createStudent(newStudent).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    await fetchStudents();
    await fetchGrades();
    setIsAddingStudent(false);
  };

  const handleEditStudent = (student: StudentType) => {
    setEditingStudent({ ...student });
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) {
      return toast.error("Por favor, rellena todos los campos");
    }

    updateStudent(editingStudent).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    await fetchStudents();

    setIsEditingStudent(false);
  };

  const handleDeleteStudent = async (id: number) => {
    deleteStudent(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    await fetchStudents();
  };
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Expedientes de Estudiantes</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiante"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Estudiante</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo estudiante aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-document" className="text-right">
                  Documento de Identidad
                </Label>
                <Input
                  id="new-document"
                  value={newStudent.document}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, document: e.target.value })
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
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
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
                  value={newStudent.dateOfBirth}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      dateOfBirth: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-grade" className="text-right">
                  Grado
                </Label>
                <Select
                  value={newStudent.gradeId.toString()}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, gradeId: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades?.map((grade: GradeType) => (
                      <SelectItem
                        key={grade.gradeId}
                        value={grade.gradeId.toString()}
                      >
                        {grade.name} - {grade.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddStudent}>Agregar Estudiante</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            Gestiona los expedientes de los estudiantes de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Grado</TableHead>
                <TableHead className="hidden sm:table-cell">Promedio</TableHead>
                <TableHead className="hidden sm:table-cell text-right pr-12">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents &&
                filteredStudents?.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="sm:hidden">
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {
                        grades?.find(
                          (grade) => grade.gradeId === student.gradeId,
                        )?.level
                      }
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">3.3</TableCell>
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
                                Expediente de {student.name}
                              </DialogTitle>
                              <DialogDescription>
                                Detalles del expediente del estudiante
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Avatar className="w-20 h-20">
                                  <AvatarImage src={``} />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left">
                                  <h3 className="font-semibold text-lg">
                                    {student.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Documento: {student.document}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>
                                    Grado:{" "}
                                    {
                                      grades?.find(
                                        (grade) =>
                                          grade.gradeId === student.gradeId,
                                      )?.level
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Fecha de Nacimiento: {student.dateOfBirth}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Book className="h-4 w-4" />
                                  <span>Promedio: 3.3</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isEditingStudent}
                          onOpenChange={setIsEditingStudent}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Estudiante</DialogTitle>
                              <DialogDescription>
                                Modifica la información del estudiante aquí.
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
                                  readOnly
                                  disabled
                                  value={editingStudent?.document}
                                  onChange={(e) => {
                                    if (editingStudent) {
                                      setEditingStudent({
                                        ...editingStudent,
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
                                  value={editingStudent?.name}
                                  onChange={(e) => {
                                    if (editingStudent) {
                                      setEditingStudent({
                                        ...editingStudent,
                                        name: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="new-grade"
                                  className="text-right"
                                >
                                  Grado
                                </Label>
                                <Select
                                  value={editingStudent?.gradeId.toString()}
                                  onValueChange={(e) => {
                                    if (editingStudent) {
                                      setEditingStudent({
                                        ...editingStudent,
                                        gradeId: parseInt(e),
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar grado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {grades?.map((grade: GradeType) => (
                                      <SelectItem
                                        key={grade.gradeId}
                                        value={grade.gradeId.toString()}
                                      >
                                        {grade.name} - {grade.level}
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
                                  value={editingStudent?.dateOfBirth}
                                  onChange={(e) => {
                                    if (editingStudent) {
                                      setEditingStudent({
                                        ...editingStudent,
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
                                permanentemente el expediente del estudiante y
                                lo removerá de nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteStudent(student.studentId)
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
