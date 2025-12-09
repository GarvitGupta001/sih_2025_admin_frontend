"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    GraduationCap,
    FileSpreadsheet,
    Download,
    Upload,
    Filter,
    ChevronDown,
    RefreshCw,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AlumniPage() {
    const [token, setToken] = useState("")
    const [alumni, setAlumni] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        degree: "",
        department: "",
        batch: "",
        status: "", // all, verified, pending
    });

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        if (token) {
            const response = axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/alumni`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setAlumni(res.data.data);
                    console.log(JSON.stringify(res.data.data));
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            window.location.href = "/login";
        }
    }, [token]);

    // Apply all filters
    const filteredAlumni = alumni.filter((a) => {
        // CHANGE: Destructure profileDetails
        const details = a.profileDetails || {};

        // CHANGE: Name/Email are at root, others in details
        const name = a.name || "";
        const email = a.email || "";
        const phone = details.phone || "";
        const graduationYear = details.graduationYear || "";
        const currentCompany = details.currentCompany || "";
        const designation = details.designation || "";

        // Search filter
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm) ||
            graduationYear.toString().includes(searchTerm) ||
            currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
            designation.toLowerCase().includes(searchTerm.toLowerCase());

        // Degree filter
        const matchesDegree =
            !filters.degree || details.degree === filters.degree;

        // Department filter
        const matchesDepartment =
            !filters.department || details.department === filters.department;

        // Batch filter
        const matchesBatch =
            !filters.batch || graduationYear.toString() === filters.batch;

        // Status filter
        const matchesStatus =
            !filters.status ||
            filters.status === "all" ||
            (filters.status === "verified" && details.verified) ||
            (filters.status === "pending" && !details.verified);

        return (
            matchesSearch &&
            matchesDegree &&
            matchesDepartment &&
            matchesBatch &&
            matchesStatus
        );
    });

    const fetchAlumni = async () => {
        try {
            const response = axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/alumni`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.success) {
                setAlumni(response.data.data);
            } else {
                toast.error("Failed to fetch alumni");
            }
        } catch (error) {
            console.error("Error fetching alumni:", error);
            toast.error("Failed to fetch alumni");
        }
    };

    const handleVerify = async (id) => {
        console.log(id);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/alumni/verify`,
                { alumniId: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.success) {
                toast.success("Alumni verified successfully");
                fetchAlumni();
            } else {
                toast.error("Failed to verify alumni");
            }
        } catch (error) {
            console.error("Error verifying alumni:", error);
            toast.error("Failed to verify alumni");
        }
    };

    // Export to Excel - client side
    const handleExportExcel = () => {
        try {
            const data = filteredAlumni.map((a) => {
                const details = a.profileDetails || {}; // ACCESS DETAILS
                return {
                    Name: a.name || "", // Root
                    Email: a.email || "", // Root
                    Phone: details.phone || "", // Details
                    "Graduation Year": details.graduationYear, // Details
                    Degree: details.degree || "", // Details
                    Department: details.department || "", // Details
                    Company: details.currentCompany || "", // Details
                    Designation: details.designation || "", // Details
                    Status: details.verified ? "Verified" : "Pending", // Details
                    Skills: details.skills?.join(", ") || "", // Details
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Alumni");
            XLSX.writeFile(
                workbook,
                `Alumni_Export_${new Date().toISOString().split("T")[0]}.xlsx`
            );
            toast.success("Excel exported successfully");
        } catch (error) {
            console.error("Export Excel error:", error);
            toast.error("Failed to export Excel");
        }
    };

    // Export to PDF - client side
    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();

            const tableColumn = [
                "Name",
                "Email",
                "Grad Year",
                "Dept",
                "Company",
                "Status",
            ];
            const tableRows = filteredAlumni.map((a) => {
                const user = a.userId;
                return [
                    user?.name || "",
                    user?.email || "",
                    a.graduationYear,
                    a.department || "",
                    a.currentCompany || "",
                    a.verified ? "Verified" : "Pending",
                ];
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [0, 17, 69] }, // #001145
            });

            doc.text("Alumni Directory", 14, 15);
            doc.save(
                `Alumni_Export_${new Date().toISOString().split("T")[0]}.pdf`
            );
            toast.success("PDF exported successfully");
        } catch (error) {
            console.error("Export PDF error:", error);
            toast.error("Failed to export PDF");
        }
    };

    // Export to CSV - client side (replaces Download Sample)
    const handleExportCSV = () => {
        try {
            const headers = [
                "Name",
                "Email",
                "Phone",
                "Graduation Year",
                "Degree",
                "Department",
                "Company",
                "Designation",
                "Status",
                "Skills",
            ];
            const rows = filteredAlumni.map((a) => {
                const user = a.userId;
                const skills = a.skills?.join("; ") || ""; // Semicolon for CSV safety within field
                return [
                    user?.name || "",
                    user?.email || "",
                    user?.phone || a.phone || "",
                    a.graduationYear,
                    a.degree || "",
                    a.department || "",
                    a.currentCompany || "",
                    a.designation || "",
                    a.verified ? "Verified" : "Pending",
                    `"${skills}"`, // Quote skills to handle commas
                ];
            });

            const csvContent = [
                headers.join(","),
                ...rows.map((row) =>
                    row
                        .map((cell) =>
                            `${cell}`.includes(",") &&
                            !`${cell}`.startsWith('"')
                                ? `"${cell}"`
                                : cell
                        )
                        .join(",")
                ),
            ].join("\n");

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Alumni_Export_${new Date().toISOString().split("T")[0]}.csv`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("CSV exported successfully");
        } catch (error) {
            console.error("Export CSV error:", error);
            toast.error("Failed to export CSV");
        }
    };

    // Handle CSV upload - connected to bulk import API
    const handleUploadCSV = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = async (e) => {
            const target = e.target;
            const file = target.files?.[0];
            if (file) {
                try {
                    toast.info(`Uploading ${file.name}...`);
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("importType", "alumni");

                    const response = await fetch(
                        `${
                            process.env.NEXT_PUBLIC_API_URL ||
                            "http://localhost:5000/api/v1"
                        }/bulk-imports`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body,
                        }
                    );

                    const data = await response.json();
                    if (data.success) {
                        toast.success(
                            `Upload successful! ${data.data.validRows} valid rows found. Processing...`
                        );
                        // Trigger processing
                        await fetch(
                            `${
                                process.env.NEXT_PUBLIC_API_URL ||
                                "http://localhost:5000/api/v1"
                            }/bulk-imports/${data.data.importId}/process`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                    )}`,
                                },
                            }
                        );
                        // Refresh alumni list after a short delay
                        setTimeout(() => fetchAlumni(), 2000);
                    } else {
                        toast.error(data.message || "Upload failed");
                    }
                } catch {
                    toast.error(
                        "Failed to upload CSV. Please check the file format."
                    );
                }
            }
        };
        input.click();
    };

    // Get unique values for filters
    const uniqueBatches = Array.from(
        new Set(
            alumni
                .map((a) => a.profileDetails?.graduationYear?.toString())
                .filter(Boolean)
        )
    ).sort((a, b) => parseInt(b) - parseInt(a));

    const pendingCount = alumni.filter(
        (a) => !a.profileDetails?.verified
    ).length;
    const verifiedCount = alumni.filter(
        (a) => a.profileDetails?.verified
    ).length;

    // Helper to get field value
    const getField = (alumni, field) => {
        const user = alumni.userId;
        return alumni[field] || user?.[field] || "";
    };

    return (
        <PageLayout>
            <div className="min-h-screen bg-[#ffffff] p-8 font-sans">
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#001439]">
                            Alumni Directory
                        </h1>
                        <p className="text-[#7088aa] mt-1">
                            Manage and track your alumni network
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbeaff] rounded-lg text-[#4a5f7c] text-sm font-semibold hover:bg-[#f6f9fe] hover:text-[#001145] transition-colors shadow-sm"
                        >
                            <FileSpreadsheet size={16} />
                            Export Excel
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbeaff] rounded-lg text-[#4a5f7c] text-sm font-semibold hover:bg-[#f6f9fe] hover:text-[#001145] transition-colors shadow-sm"
                        >
                            <FileText size={16} />
                            Export PDF
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbeaff] rounded-lg text-[#4a5f7c] text-sm font-semibold hover:bg-[#f6f9fe] hover:text-[#001145] transition-colors shadow-sm"
                        >
                            <Download size={16} />
                            Download CSV
                        </button>
                        <button
                            onClick={handleUploadCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7088aa] hover:bg-[#4a5f7c] text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                        >
                            <Upload size={16} />
                            Upload CSV
                        </button>
                        <button
                            onClick={() => fetchAlumni()}
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

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-[#dbeaff] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#7088aa] font-medium">
                                    Total Alumni
                                </p>
                                <p className="text-3xl font-bold text-[#001439] mt-2">
                                    {alumni.length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-[#dbeaff] flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-[#001145]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#dbeaff] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#7088aa] font-medium">
                                    Verified
                                </p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {verifiedCount}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#dbeaff] shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#7088aa] font-medium">
                                    Pending Verification
                                </p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">
                                    {pendingCount}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Filter Section --- */}
                <div className="bg-white p-5 rounded-xl border border-[#dbeaff] shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#001145] font-bold text-sm flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </h3>
                        <ChevronDown
                            size={16}
                            className="text-[#7088aa] cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search Bar */}
                        <div className="relative md:col-span-1">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8bdda]"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search alumni..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#001439] placeholder-[#a8bdda] focus:outline-none focus:border-[#001145] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Degree Filter */}
                        <select
                            className="w-full px-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] appearance-none cursor-pointer"
                            value={filters.degree}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    degree: e.target.value,
                                })
                            }
                            aria-label="Filter by degree"
                        >
                            <option value="">All Degrees</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="MBA">MBA</option>
                            <option value="BBA">BBA</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="M.Sc">M.Sc</option>
                            <option value="Ph.D">Ph.D</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Department Filter */}
                        <select
                            className="w-full px-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] appearance-none cursor-pointer"
                            value={filters.department}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    department: e.target.value,
                                })
                            }
                            aria-label="Filter by department"
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">
                                Computer Science
                            </option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Chemical">Chemical</option>
                            <option value="Electrical">Electrical</option>
                            <option value="IT">IT</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            className="w-full px-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] appearance-none cursor-pointer"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                })
                            }
                            aria-label="Filter by status"
                        >
                            <option value="">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                        </select>

                        {/* Batch Dropdown */}
                        <select
                            className="w-full px-4 py-2.5 bg-[#f6f9fe] border border-[#dbeaff] rounded-lg text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] appearance-none cursor-pointer"
                            value={filters.batch}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    batch: e.target.value,
                                })
                            }
                            aria-label="Filter by graduation year"
                        >
                            <option value="">All Batches</option>
                            {uniqueBatches.map((batch) => (
                                <option key={batch} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-[#dbeaff] shadow-sm p-12 text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#7088aa]" />
                        <p className="text-[#7088aa]">Loading alumni data...</p>
                    </div>
                ) : (
                    <>
                        {/* --- Data Table --- */}
                        <div className="bg-white rounded-xl border border-[#dbeaff] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1200px]">
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
                                                Phone
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Graduation Year
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Skills
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
                                        {filteredAlumni.map((alumniItem) => {
                                            // CHANGE: Access profileDetails safely
                                            const details =
                                                alumniItem.profileDetails || {};

                                            return (
                                                <tr
                                                    key={alumniItem._id}
                                                    className="hover:bg-[#f6f9fe] transition-colors group"
                                                >
                                                    {/* Name - Root Level */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-[#001439]">
                                                            {alumniItem.name ||
                                                                "N/A"}
                                                        </div>
                                                    </td>

                                                    {/* Email - Root Level */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a
                                                            href={`mailto:${alumniItem.email}`}
                                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                        >
                                                            {alumniItem.email ||
                                                                "N/A"}
                                                        </a>
                                                    </td>

                                                    {/* Phone - Inside profileDetails */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-[#4a5f7c]">
                                                            {details.phone ||
                                                                "N/A"}
                                                        </div>
                                                    </td>

                                                    {/* Graduation Year - Inside profileDetails */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#dbeaff] text-[#001145]">
                                                            {details.graduationYear ||
                                                                "N/A"}
                                                        </span>
                                                    </td>

                                                    {/* Skills - Inside profileDetails */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {details.skills
                                                                ?.slice(0, 2)
                                                                .map(
                                                                    (
                                                                        skill,
                                                                        i
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="px-2 py-1 text-xs bg-[#f6f9fe] text-[#001145] rounded-full border border-[#dbeaff]"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            {details.skills
                                                                ?.length >
                                                                2 && (
                                                                <span className="px-2 py-1 text-xs bg-[#f6f9fe] text-[#7088aa] rounded-full border border-[#dbeaff]">
                                                                    +
                                                                    {details
                                                                        .skills
                                                                        .length -
                                                                        2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Verified Status - Inside profileDetails */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                details.verified
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {details.verified
                                                                ? "Verified"
                                                                : "Pending"}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAlumni(
                                                                        alumniItem
                                                                    ); // Pass the whole item
                                                                    setIsViewDialogOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-[#7088aa] hover:text-[#001145] transition-colors p-1"
                                                                title="View Details"
                                                            >
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            </button>

                                                            {/* Degree URL - Inside details */}
                                                            {details.degreeUrl && (
                                                                <button
                                                                    onClick={() =>
                                                                        window.open(
                                                                            details.degreeUrl,
                                                                            "_blank"
                                                                        )
                                                                    }
                                                                    className="text-[#7088aa] hover:text-[#001145] transition-colors p-1"
                                                                    title="View Degree"
                                                                >
                                                                    <FileText
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            )}

                                                            {/* Verification Action */}
                                                            {!details.verified && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            details._id
                                                                        )
                                                                    } // Pass profile details ID or Root ID depending on your API
                                                                    className="text-green-600 hover:text-green-700 transition-colors p-1"
                                                                    title="Verify Alumni"
                                                                >
                                                                    <CheckCircle
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            )}
                                                            <button className="text-[#a8bdda] hover:text-[#001145] transition-colors p-1">
                                                                <MoreHorizontal
                                                                    size={18}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State (if no data) */}
                            {filteredAlumni.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-[#7088aa]">
                                        {alumni.length === 0
                                            ? "No alumni found in the database."
                                            : "No alumni match your filters."}
                                    </p>
                                    {alumni.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setFilters({
                                                    degree: "",
                                                    department: "",
                                                    batch: "",
                                                    status: "",
                                                });
                                            }}
                                            className="mt-4 text-sm text-[#001145] hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination Footer */}
                            <div className="px-6 py-4 bg-white border-t border-[#dbeaff] flex items-center justify-between">
                                <span className="text-sm text-[#7088aa]">
                                    Showing{" "}
                                    <span className="font-bold text-[#001439]">
                                        {filteredAlumni.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-[#001439]">
                                        {alumni.length}
                                    </span>{" "}
                                    entries
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm border border-[#dbeaff] rounded hover:bg-[#f6f9fe] disabled:opacity-50">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-[#dbeaff] rounded hover:bg-[#f6f9fe] bg-[#001145] text-white">
                                        1
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-[#dbeaff] rounded hover:bg-[#f6f9fe]">
                                        2
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-[#dbeaff] rounded hover:bg-[#f6f9fe]">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* View Dialog */}
                <Dialog
                    open={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                >
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#001145]">
                                Alumni Details
                            </DialogTitle>
                            <DialogDescription className="text-[#7088aa]">
                                View detailed information about this alumni
                            </DialogDescription>
                        </DialogHeader>
                        {selectedAlumni && (
                            <div className="space-y-4">
                                {/* Define details constant for easier access inside render */}
                                {(() => {
                                    const details =
                                        selectedAlumni.profileDetails || {};
                                    return (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-bold text-[#001145]">
                                                        Name
                                                    </label>
                                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                                        {selectedAlumni.name ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-[#001145]">
                                                        Email
                                                    </label>
                                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                                        {selectedAlumni.email ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-[#001145]">
                                                        Phone
                                                    </label>
                                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                                        {details.phone || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-[#001145]">
                                                        Graduation Year
                                                    </label>
                                                    <p className="text-sm text-[#4a5f7c] mt-1">
                                                        {details.graduationYear}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-[#001145]">
                                                        Verification Status
                                                    </label>
                                                    <div className="mt-1">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                details.verified
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {details.verified
                                                                ? "Verified"
                                                                : "Pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-[#001145]">
                                                    Skills
                                                </label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {details.skills &&
                                                    details.skills.length >
                                                        0 ? (
                                                        details.skills.map(
                                                            (skill, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-3 py-1 text-xs bg-[#dbeaff] text-[#001145] rounded-full font-medium"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <p className="text-sm text-[#7088aa]">
                                                            No skills listed
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsViewDialogOpen(false)}
                                className="border-[#dbeaff] text-[#4a5f7c] hover:bg-[#f6f9fe]"
                            >
                                Close
                            </Button>

                            {/* CHANGE: Check profileDetails for degreeUrl */}
                            {selectedAlumni?.profileDetails?.degreeUrl && (
                                <Button
                                    onClick={() =>
                                        window.open(
                                            selectedAlumni.profileDetails
                                                .degreeUrl,
                                            "_blank"
                                        )
                                    }
                                    className="bg-[#7088aa] hover:bg-[#4a5f7c] text-white"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Degree
                                </Button>
                            )}

                            {/* CHANGE: Check profileDetails for verification status */}
                            {selectedAlumni?.profileDetails &&
                                !selectedAlumni.profileDetails.verified && (
                                    <Button
                                        onClick={() => {
                                            // CHANGE: Pass the specific profileDetails ID for verification
                                            // (Or keep selectedAlumni._id if your backend expects the User ID)
                                            handleVerify(
                                                selectedAlumni.profileDetails
                                                    ._id
                                            );
                                            setIsViewDialogOpen(false);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verify Alumni
                                    </Button>
                                )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PageLayout>
    );
}
