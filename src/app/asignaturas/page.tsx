"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

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
import { createSubject, deleteSubject, updateSubject } from "@/actions";
import { toast } from "sonner";

interface SubjectType {
  subjectId: number;
  name: string;
}

export default function SubjectPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState<SubjectType[] | null>(null);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectType | null>(
    null,
  );

  const [newSubject, setNewSubject] = useState<Omit<SubjectType, "subjectId">>({
    name: "",
  });

  const filteredSubjects = subjects?.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Fetch subjects when component loads
  const fetchSubjects = async () => {
    const response = await fetch("http://localhost:3000/api/subjects", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, [isAddingSubject]);

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error("Por favor, ingresa el nombre de la asignatura");
      return;
    }

    createSubject(newSubject).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    setIsAddingSubject(false);
    fetchSubjects();
  };

  const handleEditSubject = (subject: SubjectType) => {
    setEditingSubject({ ...subject });
  };

  const handleSaveEdit = () => {
    if (editingSubject) {
      console.log(editingSubject);

      updateSubject(editingSubject).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);

          setSubjects(
            subjects?.map((subject) =>
              subject.subjectId === editingSubject.subjectId
                ? editingSubject
                : subject,
            ) || null,
          );
        }
      });
    }
    setIsEditingSubject(false);
  };

  const handleDeleteSubject = (id: number) => {
    console.log(id);
    deleteSubject(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setSubjects(
          subjects?.filter((subject) => subject.subjectId !== id) || null,
        );
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Asignaturas</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar asignatura"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Asignatura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Asignatura</DialogTitle>
              <DialogDescription>
                Ingrese el nombre de la nueva asignatura aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="new-name"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddSubject}>Agregar Asignatura</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Asignaturas</CardTitle>
          <CardDescription>
            Gestiona las asignaturas de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects &&
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.subjectId}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog
                          open={isEditingSubject}
                          onOpenChange={setIsEditingSubject}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditSubject(subject)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Asignatura</DialogTitle>
                              <DialogDescription>
                                Modifica el nombre de la asignatura aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="name"
                                  value={editingSubject?.name}
                                  onChange={(e) => {
                                    if (editingSubject) {
                                      setEditingSubject({
                                        ...editingSubject,
                                        name: e.target.value,
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
                                permanentemente la asignatura y la removerá de
                                nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteSubject(subject.subjectId)
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
