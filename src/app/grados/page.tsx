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
import { createGrade, deleteGrade, updateGrade } from "@/actions";
import { toast } from "sonner";

interface GradeType {
  gradeId: number;
  name: string;
  level: string;
}

export default function GradePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState<GradeType[] | null>(null);
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeType | null>(null);

  const [newGrade, setNewGrade] = useState<Omit<GradeType, "gradeId">>({
    name: "",
    level: "",
  });

  const filteredGrades = grades?.filter(
    (grade) =>
      grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.level.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Fetch grades when component loads
  const fetchGrades = async () => {
    const response = await fetch("http://localhost:3000/api/grades", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
    setGrades(data);
  };

  useEffect(() => {
    fetchGrades();
  }, [isAddingGrade]);

  const handleAddGrade = () => {
    if (!newGrade.name || !newGrade.level) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    createGrade(newGrade).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    setIsAddingGrade(false);
    fetchGrades();
  };

  const handleEditGrade = (grade: GradeType) => {
    setEditingGrade({ ...grade });
  };

  const handleSaveEdit = () => {
    if (editingGrade) {
      updateGrade(editingGrade).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setGrades(
            grades?.map((grade) =>
              grade.gradeId === editingGrade.gradeId ? editingGrade : grade,
            ) || null,
          );
        }
      });
    }
    setIsEditingGrade(false);
  };

  const handleDeleteGrade = (id: number) => {
    deleteGrade(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setGrades(grades?.filter((grade) => grade.gradeId !== id) || null);
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Grados</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grado"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingGrade} onOpenChange={setIsAddingGrade}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Grado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Grado</DialogTitle>
              <DialogDescription>
                Ingrese la información del nuevo grado aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="new-name"
                  value={newGrade.name}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-level" className="text-right">
                  Nivel
                </Label>
                <Input
                  id="new-level"
                  value={newGrade.level}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, level: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGrade}>Agregar Grado</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Grados</CardTitle>
          <CardDescription>
            Gestiona los grados académicos de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades &&
                filteredGrades.map((grade) => (
                  <TableRow key={grade.gradeId}>
                    <TableCell>{grade.name}</TableCell>
                    <TableCell>{grade.level}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog
                          open={isEditingGrade}
                          onOpenChange={setIsEditingGrade}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditGrade(grade)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Grado</DialogTitle>
                              <DialogDescription>
                                Modifica la información del grado aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="name"
                                  value={editingGrade?.name}
                                  onChange={(e) => {
                                    if (editingGrade) {
                                      setEditingGrade({
                                        ...editingGrade,
                                        name: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="level" className="text-right">
                                  Nivel
                                </Label>
                                <Input
                                  id="level"
                                  value={editingGrade?.level}
                                  onChange={(e) => {
                                    if (editingGrade) {
                                      setEditingGrade({
                                        ...editingGrade,
                                        level: e.target.value,
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
                                permanentemente el grado y lo removerá de
                                nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGrade(grade.gradeId)}
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
