"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, GraduationCap, Pencil, Trash2, Plus } from "lucide-react";

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
import { createScore, deleteScore, updateScore } from "@/actions";
import { toast } from "sonner";

export default function ScoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scores, setScores] = useState<ScoreType[] | null>(null);
  const [achievements, setAchievements] = useState<AchievementType[] | null>(
    null,
  );
  const [students, setStudents] = useState<StudentType[] | null>(null);
  const [periods, setPeriods] = useState<PeriodType[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectType[] | null>(null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [editingScore, setEditingScore] = useState<ScoreType | null>(null);

  const [newScore, setNewScore] = useState<Omit<ScoreType, "scoreId">>({
    achievementId: 0,
    studentId: 0,
    score: 0,
    comments: "",
  });

  const filteredScores = scores?.filter(
    (score) =>
      students
        ?.find((s) => s.studentId === score.studentId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      achievements
        ?.find((a) => a.achievementId === score.achievementId)
        ?.achievementDescription.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Fetch data when component loads
  const fetchData = async () => {
    const scoresResponse = await fetch("http://localhost:3000/api/scores");
    const scoresData = await scoresResponse.json();
    setScores(scoresData);

    const achievementsResponse = await fetch(
      "http://localhost:3000/api/achievements",
    );
    const achievementsData = await achievementsResponse.json();
    setAchievements(achievementsData);

    const studentsResponse = await fetch("http://localhost:3000/api/students");
    const studentsData = await studentsResponse.json();
    setStudents(studentsData);

    const periodsResponse = await fetch("http://localhost:3000/api/periods");
    const periodsData = await periodsResponse.json();
    setPeriods(periodsData);

    const subjectsResponse = await fetch("http://localhost:3000/api/subjects");
    const subjectsData = await subjectsResponse.json();
    setSubjects(subjectsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddScore = () => {
    if (!newScore.achievementId || !newScore.studentId || !newScore.score) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    createScore(newScore).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        fetchData();
      }
    });

    setIsAddingScore(false);
  };

  const handleEditScore = (score: ScoreType) => {
    setEditingScore({ ...score });
  };

  const handleSaveEdit = () => {
    if (editingScore) {
      updateScore(editingScore).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setScores(
            scores?.map((score) =>
              score.scoreId === editingScore.scoreId ? editingScore : score,
            ) || null,
          );
        }
      });
    }
    setIsEditingScore(false);
  };

  const handleDeleteScore = (id: number) => {
    deleteScore(id).then((result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setScores(scores?.filter((score) => score.scoreId !== id) || null);
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Calificaciones</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar calificación"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddingScore} onOpenChange={setIsAddingScore}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Calificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Calificación</DialogTitle>
              <DialogDescription>
                Ingrese la información de la nueva calificación aquí.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-achievement" className="text-right">
                  Logro
                </Label>
                <Select
                  value={newScore.achievementId.toString()}
                  onValueChange={(value) =>
                    setNewScore({ ...newScore, achievementId: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar logro" />
                  </SelectTrigger>
                  <SelectContent>
                    {achievements?.map((achievement) => (
                      <SelectItem
                        key={achievement.achievementId}
                        value={achievement.achievementId.toString()}
                      >
                        {achievement.achievementDescription}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-student" className="text-right">
                  Estudiante
                </Label>
                <Select
                  value={newScore.studentId.toString()}
                  onValueChange={(value) =>
                    setNewScore({ ...newScore, studentId: parseInt(value) })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((student) => (
                      <SelectItem
                        key={student.studentId}
                        value={student.studentId.toString()}
                      >
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-score" className="text-right">
                  Calificación
                </Label>
                <Input
                  id="new-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newScore.score}
                  onChange={(e) =>
                    setNewScore({
                      ...newScore,
                      score: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-comments" className="text-right">
                  Comentarios
                </Label>
                <Input
                  id="new-comments"
                  value={newScore.comments}
                  onChange={(e) =>
                    setNewScore({ ...newScore, comments: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddScore}>Agregar Calificación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Calificaciones</CardTitle>
          <CardDescription>
            Gestiona las calificaciones de los estudiantes por logro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Asignatura</TableHead>
                <TableHead>Logro</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores &&
                filteredScores.map((score) => {
                  const achievement = achievements?.find(
                    (a) => a.achievementId === score.achievementId,
                  );
                  const student = students?.find(
                    (s) => s.studentId === score.studentId,
                  );
                  const period = periods?.find(
                    (p) => p.periodId === achievement?.periodId,
                  );
                  const subject = subjects?.find(
                    (s) => s.subjectId === achievement?.subjectId,
                  );

                  return (
                    <TableRow key={score.scoreId}>
                      <TableCell>
                        {student ? `${student.name}` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {period
                          ? `${period.periodNumber} - ${period.academicYear} - ${period.gradeName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{subject?.name || "N/A"}</TableCell>
                      <TableCell>
                        {achievement?.achievementDescription || "N/A"}
                      </TableCell>
                      <TableCell>{score.score}</TableCell>
                      <TableCell>{score.comments}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog
                            open={isEditingScore}
                            onOpenChange={setIsEditingScore}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => handleEditScore(score)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Calificación</DialogTitle>
                                <DialogDescription>
                                  Modifica la información de la calificación
                                  aquí.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-achievement"
                                    className="text-right"
                                  >
                                    Logro
                                  </Label>
                                  <Select
                                    value={editingScore?.achievementId.toString()}
                                    onValueChange={(value) => {
                                      if (editingScore) {
                                        setEditingScore({
                                          ...editingScore,
                                          achievementId: parseInt(value),
                                        });
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccionar logro" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {achievements?.map((achievement) => (
                                        <SelectItem
                                          key={achievement.achievementId}
                                          value={achievement.achievementId.toString()}
                                        >
                                          {achievement.achievementDescription}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-student"
                                    className="text-right"
                                  >
                                    Estudiante
                                  </Label>
                                  <Select
                                    value={editingScore?.studentId.toString()}
                                    onValueChange={(value) => {
                                      if (editingScore) {
                                        setEditingScore({
                                          ...editingScore,
                                          studentId: parseInt(value),
                                        });
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccionar estudiante" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {students?.map((student) => (
                                        <SelectItem
                                          key={student.studentId}
                                          value={student.studentId.toString()}
                                        >
                                          {student.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-score"
                                    className="text-right"
                                  >
                                    Calificación
                                  </Label>
                                  <Input
                                    id="edit-score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={editingScore?.score}
                                    onChange={(e) => {
                                      if (editingScore) {
                                        setEditingScore({
                                          ...editingScore,
                                          score: parseFloat(e.target.value),
                                        });
                                      }
                                    }}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-comments"
                                    className="text-right"
                                  >
                                    Comentarios
                                  </Label>
                                  <Input
                                    id="edit-comments"
                                    value={editingScore?.comments}
                                    onChange={(e) => {
                                      if (editingScore) {
                                        setEditingScore({
                                          ...editingScore,
                                          comments: e.target.value,
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
                                  Esta acción no se puede deshacer. Esto
                                  eliminará permanentemente la calificación y la
                                  removerá de nuestros servidores.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteScore(score.scoreId)
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
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
