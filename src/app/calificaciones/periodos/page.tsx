"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Calendar, Pencil, Trash2, Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPeriod, deletePeriod, updatePeriod } from "@/actions";
import { toast } from "sonner";

interface PeriodType {
  periodId: number;
  periodNumber: number;
  gradeId: number;
  academicYear: string;
  description: string;
}

interface GradeType {
  gradeId: number;
  name: string;
}

export default function PeriodPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periods, setPeriods] = useState<PeriodType[] | null>(null);
  const [grades, setGrades] = useState<GradeType[] | null>(null);
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PeriodType | null>(null);

  const [newPeriod, setNewPeriod] = useState<Omit<PeriodType, "periodId">>({
    periodNumber: 1,
    gradeId: 1,
    academicYear: "",
    description: "",
  });

  const filteredPeriods = periods?.filter(
    (period) =>
      period.academicYear.includes(searchTerm) ||
      period.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Fetch periods and grades when component loads
  const fetchPeriods = async () => {
    const response = await fetch("http://localhost:3000/api/periods", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
    setPeriods(data);
  };

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
    fetchPeriods();
    fetchGrades();
  }, [isAddingPeriod]);

  const handleAddPeriod = () => {
    if (
      !newPeriod.periodNumber ||
      !newPeriod.gradeId ||
      !newPeriod.academicYear
    ) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    createPeriod(newPeriod).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    setIsAddingPeriod(false);
    fetchPeriods();
  };

  const handleEditPeriod = (period: PeriodType) => {
    setEditingPeriod({ ...period });
  };

  const handleSaveEdit = () => {
    if (editingPeriod) {
      updatePeriod(editingPeriod).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setPeriods(
            periods?.map((period) =>
              period.periodId === editingPeriod.periodId
                ? editingPeriod
                : period,
            ) || null,
          );
        }
      });
    }
    setIsEditingPeriod(false);
  };

  const handleDeletePeriod = (id: number) => {
    deletePeriod(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setPeriods(periods?.filter((period) => period.periodId !== id) || null);
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Periodos</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar periodo"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingPeriod} onOpenChange={setIsAddingPeriod}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Periodo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Periodo</DialogTitle>
              <DialogDescription>
                Ingrese la información del nuevo periodo aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-period-number" className="text-right">
                  Número de Periodo
                </Label>
                <Input
                  id="new-period-number"
                  type="number"
                  value={newPeriod.periodNumber}
                  onChange={(e) =>
                    setNewPeriod({
                      ...newPeriod,
                      periodNumber: parseInt(e.target.value),
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
                  value={newPeriod.gradeId.toString()}
                  onValueChange={(value) =>
                    setNewPeriod({ ...newPeriod, gradeId: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades?.map((grade) => (
                      <SelectItem
                        key={grade.gradeId}
                        value={grade.gradeId.toString()}
                      >
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-academic-year" className="text-right">
                  Año Académico
                </Label>
                <Input
                  id="new-academic-year"
                  value={newPeriod.academicYear}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, academicYear: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="YYYY-YYYY"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="new-description"
                  value={newPeriod.description}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPeriod}>Agregar Periodo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Periodos</CardTitle>
          <CardDescription>
            Gestiona los periodos académicos de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Año Académico</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeriods &&
                filteredPeriods.map((period) => (
                  <TableRow key={period.periodId}>
                    <TableCell>{period.periodNumber}</TableCell>
                    <TableCell>
                      {grades?.find((g) => g.gradeId === period.gradeId)?.name}
                    </TableCell>
                    <TableCell>{period.academicYear}</TableCell>
                    <TableCell>{period.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog
                          open={isEditingPeriod}
                          onOpenChange={setIsEditingPeriod}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditPeriod(period)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Periodo</DialogTitle>
                              <DialogDescription>
                                Modifica la información del periodo aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-period-number"
                                  className="text-right"
                                >
                                  Número de Periodo
                                </Label>
                                <Input
                                  id="edit-period-number"
                                  type="number"
                                  value={editingPeriod?.periodNumber}
                                  onChange={(e) => {
                                    if (editingPeriod) {
                                      setEditingPeriod({
                                        ...editingPeriod,
                                        periodNumber: parseInt(e.target.value),
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-grade"
                                  className="text-right"
                                >
                                  Grado
                                </Label>
                                <Select
                                  value={editingPeriod?.gradeId.toString()}
                                  onValueChange={(value) => {
                                    if (editingPeriod) {
                                      setEditingPeriod({
                                        ...editingPeriod,
                                        gradeId: parseInt(value),
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar grado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {grades?.map((grade) => (
                                      <SelectItem
                                        key={grade.gradeId}
                                        value={grade.gradeId.toString()}
                                      >
                                        {grade.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-academic-year"
                                  className="text-right"
                                >
                                  Año Académico
                                </Label>
                                <Input
                                  id="edit-academic-year"
                                  value={editingPeriod?.academicYear}
                                  onChange={(e) => {
                                    if (editingPeriod) {
                                      setEditingPeriod({
                                        ...editingPeriod,
                                        academicYear: e.target.value,
                                      });
                                    }
                                  }}
                                  className="col-span-3"
                                  placeholder="YYYY-YYYY"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-description"
                                  className="text-right"
                                >
                                  Descripción
                                </Label>
                                <Input
                                  id="edit-description"
                                  value={editingPeriod?.description}
                                  onChange={(e) => {
                                    if (editingPeriod) {
                                      setEditingPeriod({
                                        ...editingPeriod,
                                        description: e.target.value,
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
                                permanentemente el periodo y lo removerá de
                                nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeletePeriod(period.periodId)
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
