"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import PageLayout from "@/components/dashboard/PageLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Users, BookOpen, GraduationCap } from "lucide-react";

export default function StudentsPage() {
    const token = localStorage.getItem("token");
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        if (token) {
            const response = axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    // Assuming res.data.data is an array of the object structure provided
                    setStudents(res.data.data);
                    console.log(JSON.stringify(res.data.data));
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [token]);

    // Updated Filter Logic based on new JSON structure
    const filteredStudents = students.filter((s) => {
        // Name and Email are now at the root level
        const name = s.name || "";
        const email = s.email || "";
        // Academic details are nested inside profileDetails
        const degreeName = s.profileDetails?.academic?.degreeName || "";

        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            degreeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Updated Stats Logic
    const activeStudents = students.filter(
        (s) => !s.profileDetails?.academic?.isCompleted
    ).length;

    const graduatedStudents = students.filter(
        (s) => s.profileDetails?.academic?.isCompleted
    ).length;

    return (
        <PageLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Students
                        </h1>
                        <p className="text-muted-foreground">
                            View and manage student accounts
                        </p>
                    </div>
                </div>

                {/* Stats - Sarthak Theme */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Total Students
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Users className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {students.length}
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Active
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <BookOpen className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {activeStudents}
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Graduated
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <GraduationCap className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {graduatedStudents}
                        </p>
                    </div>
                </div>

                {/* Students Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student List</CardTitle>
                        <CardDescription>
                            View all registered students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Degree</TableHead>
                                        <TableHead>Current Year</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-20">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Skeleton className="h-4 w-32" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-4 w-40" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-4 w-24" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-4 w-16" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-6 w-20" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton className="h-8 w-8" />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    ) : filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8"
                                            >
                                                <p className="text-muted-foreground">
                                                    No students found
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map((student) => {
                                            // Accessing profileDetails directly
                                            const academic =
                                                student.profileDetails
                                                    ?.academic;

                                            return (
                                                <TableRow key={student._id}>
                                                    <TableCell className="font-medium">
                                                        {student.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {student.email || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {academic?.degreeName ||
                                                                    "N/A"}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {academic?.degreeType ||
                                                                    ""}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        Year{" "}
                                                        {academic?.currentYear ||
                                                            1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                academic?.isCompleted
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {academic?.isCompleted
                                                                ? "Graduated"
                                                                : "Active"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedStudent(
                                                                    student
                                                                );
                                                                setIsViewDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* View Dialog */}
                <Dialog
                    open={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Student Details</DialogTitle>
                            <DialogDescription>
                                View detailed information about this student
                            </DialogDescription>
                        </DialogHeader>
                        {selectedStudent && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </label>
                                    <p className="text-sm">
                                        {selectedStudent.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <p className="text-sm">
                                        {selectedStudent.email || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Degree
                                    </label>
                                    <p className="text-sm">
                                        {
                                            selectedStudent.profileDetails
                                                ?.academic?.degreeName
                                        }{" "}
                                        (
                                        {
                                            selectedStudent.profileDetails
                                                ?.academic?.degreeType
                                        }
                                        )
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Current Year
                                    </label>
                                    <p className="text-sm">
                                        Year{" "}
                                        {selectedStudent.profileDetails
                                            ?.academic?.currentYear || 1}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Entry Date
                                    </label>
                                    <p className="text-sm">
                                        {selectedStudent.profileDetails
                                            ?.academic?.entryDate
                                            ? new Date(
                                                  selectedStudent.profileDetails.academic.entryDate
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Expected Graduation
                                    </label>
                                    <p className="text-sm">
                                        {selectedStudent.profileDetails
                                            ?.academic?.expectedGraduationDate
                                            ? new Date(
                                                  selectedStudent.profileDetails.academic.expectedGraduationDate
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        <Badge
                                            variant={
                                                selectedStudent.profileDetails
                                                    ?.academic?.isCompleted
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {selectedStudent.profileDetails
                                                ?.academic?.isCompleted
                                                ? "Graduated"
                                                : "Active"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </PageLayout>
    );
}
