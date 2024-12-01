"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Award, Pencil, Trash2, Plus } from "lucide-react";

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
import {
  createAchievement,
  deleteAchievement,
  updateAchievement,
} from "@/actions";
import { toast } from "sonner";

export default function AchievementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [achievements, setAchievements] = useState<AchievementType[] | null>(
    null,
  );
  const [periods, setPeriods] = useState<PeriodType[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectType[] | null>(null);
  const [isEditingAchievement, setIsEditingAchievement] = useState(false);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<AchievementType | null>(null);

  const [newAchievement, setNewAchievement] = useState<
    Omit<AchievementType, "achievementId">
  >({
    periodId: 0,
    subjectId: 0,
    achievementDescription: "",
  });

  const filteredAchievements = achievements?.filter((achievement) =>
    achievement.achievementDescription
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Fetch achievements, periods, and subjects when component loads
  const fetchAchievements = async () => {
    const response = await fetch("http://localhost:3000/api/achievements", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
    setAchievements(data);
  };

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
    fetchAchievements();
    fetchPeriods();
    fetchSubjects();
  }, [isAddingAchievement]);

  const handleAddAchievement = () => {
    if (
      !newAchievement.periodId ||
      !newAchievement.subjectId ||
      !newAchievement.achievementDescription
    ) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    createAchievement(newAchievement).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });

    setIsAddingAchievement(false);
    fetchAchievements();
  };

  const handleEditAchievement = (achievement: AchievementType) => {
    setEditingAchievement({ ...achievement });
  };

  const handleSaveEdit = () => {
    if (editingAchievement) {
      updateAchievement(editingAchievement).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setAchievements(
            achievements?.map((achievement) =>
              achievement.achievementId === editingAchievement.achievementId
                ? editingAchievement
                : achievement,
            ) || null,
          );
        }
      });
    }
    setIsEditingAchievement(false);
  };

  const handleDeleteAchievement = (id: number) => {
    deleteAchievement(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setAchievements(
          achievements?.filter(
            (achievement) => achievement.achievementId !== id,
          ) || null,
        );
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Logros</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar logro"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog
          open={isAddingAchievement}
          onOpenChange={setIsAddingAchievement}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Logro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Logro</DialogTitle>
              <DialogDescription>
                Ingrese la información del nuevo logro aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-period" className="text-right">
                  Periodo
                </Label>
                <Select
                  value={newAchievement.periodId.toString()}
                  onValueChange={(value) =>
                    setNewAchievement({
                      ...newAchievement,
                      periodId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods?.map((period) => (
                      <SelectItem
                        key={period.periodId}
                        value={period.periodId.toString()}
                      >
                        {`${period.periodNumber} - ${period.academicYear} - ${period.gradeName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-subject" className="text-right">
                  Asignatura
                </Label>
                <Select
                  value={newAchievement.subjectId.toString()}
                  onValueChange={(value) =>
                    setNewAchievement({
                      ...newAchievement,
                      subjectId: parseInt(value),
                    })
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="new-description"
                  value={newAchievement.achievementDescription}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      achievementDescription: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAchievement}>Agregar Logro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Logros</CardTitle>
          <CardDescription>
            Gestiona los logros académicos de la institución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead>Asignatura</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAchievements &&
                filteredAchievements.map((achievement) => (
                  <TableRow key={achievement.achievementId}>
                    <TableCell>
                      {
                        periods?.find(
                          (p) => p.periodId === achievement.periodId,
                        )?.periodNumber
                      }{" "}
                      -{" "}
                      {
                        periods?.find(
                          (p) => p.periodId === achievement.periodId,
                        )?.academicYear
                      }{" "}
                      -{" "}
                      {
                        periods?.find(
                          (p) => p.periodId === achievement.periodId,
                        )?.gradeName
                      }
                    </TableCell>
                    <TableCell>
                      {
                        subjects?.find(
                          (s) => s.subjectId === achievement.subjectId,
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{achievement.achievementDescription}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog
                          open={isEditingAchievement}
                          onOpenChange={setIsEditingAchievement}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleEditAchievement(achievement)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Logro</DialogTitle>
                              <DialogDescription>
                                Modifica la información del logro aquí.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-period"
                                  className="text-right"
                                >
                                  Periodo
                                </Label>
                                <Select
                                  value={editingAchievement?.periodId.toString()}
                                  onValueChange={(value) => {
                                    if (editingAchievement) {
                                      setEditingAchievement({
                                        ...editingAchievement,
                                        periodId: parseInt(value),
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar periodo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {periods?.map((period) => (
                                      <SelectItem
                                        key={period.periodId}
                                        value={period.periodId.toString()}
                                      >
                                        {`${period.periodNumber} - ${period.academicYear} - ${period.gradeName}`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-subject"
                                  className="text-right"
                                >
                                  Asignatura
                                </Label>
                                <Select
                                  value={editingAchievement?.subjectId.toString()}
                                  onValueChange={(value) => {
                                    if (editingAchievement) {
                                      setEditingAchievement({
                                        ...editingAchievement,
                                        subjectId: parseInt(value),
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
                                  htmlFor="edit-description"
                                  className="text-right"
                                >
                                  Descripción
                                </Label>
                                <Input
                                  id="edit-description"
                                  value={
                                    editingAchievement?.achievementDescription
                                  }
                                  onChange={(e) => {
                                    if (editingAchievement) {
                                      setEditingAchievement({
                                        ...editingAchievement,
                                        achievementDescription: e.target.value,
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
                                permanentemente el logro y lo removerá de
                                nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteAchievement(
                                    achievement.achievementId,
                                  )
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
