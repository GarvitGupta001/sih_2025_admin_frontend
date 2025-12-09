"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Search,
    Eye,
    Users,
    BookOpen,
    GraduationCap,
    Upload,
    RefreshCw,
    FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function StudentsPage() {
    const [token, setToken] = useState("");
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const fetchStudents = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/students`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStudents(response.data.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch students");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStudents();
        }
    }, [token]);

    // Handle file import
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Validate and transform the data
                const importedStudents = jsonData.map((row, index) => ({
                    _id: `imported_${index}_${Date.now()}`,
                    name: row.Name || row.name || "",
                    email: row.Email || row.email || "",
                    profileDetails: {
                        academic: {
                            degreeName: row.Degree || row.degreeName || row["Degree Name"] || "",
                            degreeType: row["Degree Type"] || row.degreeType || "",
                            currentYear: parseInt(row["Current Year"] || row.currentYear) || 1,
                            isCompleted: (row.Status || row.status || "").toLowerCase() === "graduated",
                            entryDate: row["Entry Date"] || row.entryDate || null,
                            expectedGraduationDate: row["Expected Graduation"] || row.expectedGraduationDate || null,
                        },
                    },
                }));

                if (importedStudents.length === 0) {
                    toast.error("No valid data found in the file");
                    return;
                }

                // Add imported students to the list (preview mode)
                setStudents((prev) => [...prev, ...importedStudents]);
                toast.success(`Successfully imported ${importedStudents.length} students`);
            } catch (error) {
                console.error("Import error:", error);
                toast.error("Failed to import file. Please check the format.");
            } finally {
                setIsImporting(false);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.onerror = () => {
            toast.error("Failed to read file");
            setIsImporting(false);
        };

        reader.readAsArrayBuffer(file);
    };

    // Updated Filter Logic based on new JSON structure
    const filteredStudents = students.filter((s) => {
        const name = s.name || "";
        const email = s.email || "";
        const degreeName = s.profileDetails?.academic?.degreeName || "";

        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            degreeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const activeStudents = students.filter(
        (s) => !s.profileDetails?.academic?.isCompleted
    ).length;

    const graduatedStudents = students.filter(
        (s) => s.profileDetails?.academic?.isCompleted
    ).length;

    return (
        <PageLayout>
            <div className="min-h-screen bg-[#ffffff] p-8 font-sans">
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#001439]">
                            Students
                        </h1>
                        <p className="text-[#7088aa] mt-1">
                            View and manage student accounts
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImporting}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbeaff] rounded-lg text-[#4a5f7c] text-sm font-semibold hover:bg-[#f6f9fe] hover:text-[#001145] transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isImporting ? (
                                <RefreshCw size={16} className="animate-spin" />
                            ) : (
                                <Upload size={16} />
                            )}
                            Import Excel/CSV
                        </button>
                        <button
                            onClick={fetchStudents}
                            className="flex items-center gap-2 px-4 py-2 bg-[#001145] hover:bg-[#001439] text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                        >
                            <RefreshCw
                                size={16}
                                className={isLoading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>



                {/* --- Filter Section --- */}
                <div className="bg-white p-5 rounded-xl border border-[#dbeaff] shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#001145] font-bold text-sm">
                            Student List
                        </h3>
                        <p className="text-[#7088aa] text-sm">
                            View all registered students
                        </p>
                    </div>

                    <div className="relative max-w-sm">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8bdda]"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#001439] placeholder-[#a8bdda] focus:outline-none focus:border-[#001145] transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-[#dbeaff] shadow-sm p-12 text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#7088aa]" />
                        <p className="text-[#7088aa]">Loading students data...</p>
                    </div>
                ) : (
                    <>
                        {/* --- Data Table --- */}
                        <div className="bg-white rounded-xl border border-[#dbeaff] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    {/* Table Header */}
                                    <thead className="bg-[#001145] text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Degree
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Current Year
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody className="divide-y divide-[#e4f0ff]">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-12 text-center text-[#7088aa]"
                                                >
                                                    No students found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map((student) => {
                                                const academic =
                                                    student.profileDetails?.academic;

                                                return (
                                                    <tr
                                                        key={student._id}
                                                        className="hover:bg-[#f6f9fe] transition-colors group"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-[#001439]">
                                                                {student.name || "N/A"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <a
                                                                href={`mailto:${student.email}`}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {student.email || "N/A"}
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-[#001439] font-medium">
                                                                {academic?.degreeName || "N/A"}
                                                            </div>
                                                            <div className="text-xs text-[#7088aa]">
                                                                {academic?.degreeType || ""}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#dbeaff] text-[#001145]">
                                                                Year {academic?.currentYear || 1}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${academic?.isCompleted
                                                                    ? "bg-[#dbeaff] text-[#001145]"
                                                                    : "bg-green-100 text-green-800"
                                                                    }`}
                                                            >
                                                                {academic?.isCompleted
                                                                    ? "Graduated"
                                                                    : "Active"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedStudent(student);
                                                                    setIsViewDialogOpen(true);
                                                                }}
                                                                className="text-[#7088aa] hover:text-[#001145] transition-colors p-1"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="px-6 py-4 bg-white border-t border-[#dbeaff] flex items-center justify-between">
                                <span className="text-sm text-[#7088aa]">
                                    Showing{" "}
                                    <span className="font-bold text-[#001439]">
                                        {filteredStudents.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-[#001439]">
                                        {students.length}
                                    </span>{" "}
                                    entries
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* View Dialog */}
                <Dialog
                    open={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                >
                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#001145]">
                                Student Details
                            </DialogTitle>
                            <DialogDescription className="text-[#7088aa]">
                                View detailed information about this student
                            </DialogDescription>
                        </DialogHeader>
                        {selectedStudent && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Name
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        {selectedStudent.name || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Email
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        {selectedStudent.email || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Degree
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        {selectedStudent.profileDetails?.academic?.degreeName}{" "}
                                        ({selectedStudent.profileDetails?.academic?.degreeType})
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Current Year
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        Year {selectedStudent.profileDetails?.academic?.currentYear || 1}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Entry Date
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        {selectedStudent.profileDetails?.academic?.entryDate
                                            ? new Date(
                                                selectedStudent.profileDetails.academic.entryDate
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Expected Graduation
                                    </label>
                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                        {selectedStudent.profileDetails?.academic?.expectedGraduationDate
                                            ? new Date(
                                                selectedStudent.profileDetails.academic.expectedGraduationDate
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#001145]">
                                        Status
                                    </label>
                                    <div className="mt-1">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedStudent.profileDetails?.academic?.isCompleted
                                                ? "bg-[#dbeaff] text-[#001145]"
                                                : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {selectedStudent.profileDetails?.academic?.isCompleted
                                                ? "Graduated"
                                                : "Active"}
                                        </span>
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
