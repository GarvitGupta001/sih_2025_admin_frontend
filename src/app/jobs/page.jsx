"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import PageLayout from "@/components/dashboard/PageLayout";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
    Search,
    Eye,
    Trash2,
    Briefcase,
    Building,
    MapPin,
    Clock,
} from "lucide-react";
import { SARTHAK_CHART_COLORS } from "@/lib/theme";

export default function JobsPage() {
    const token = localStorage.getItem("token");
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setJobs(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to fetch jobs");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [token]);

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fullTimeCount = jobs.filter((j) => j.type === "full-time").length;
    const internshipCount = jobs.filter((j) => j.type === "internship").length;

    return (
        <PageLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#001145]">
                            Job Listings
                        </h1>
                        <p className="text-[#7088aa] mt-1">
                            Manage and post job opportunities for alumni
                        </p>
                    </div>
                </div>

                {/* Stats Cards - Sarthak Theme (subtle icons) */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Total Jobs */}
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Total Jobs
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Briefcase
                                    size={18}
                                    className="text-[#4a5f7c]"
                                />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {jobs.length}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            Active postings
                        </p>
                    </div>

                    {/* Full-time */}
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Full-time
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Building
                                    size={18}
                                    className="text-[#4a5f7c]"
                                />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {fullTimeCount}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            Full-time positions
                        </p>
                    </div>

                    {/* Internships */}
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Internships
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <MapPin size={18} className="text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {internshipCount}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            Internship opportunities
                        </p>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-2xl border border-[#e4f0ff] shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-[#e4f0ff]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#001145]">
                                    All Job Postings
                                </h2>
                                <p className="text-[#7088aa] text-sm mt-1">
                                    {filteredJobs.length} jobs found
                                </p>
                            </div>
                            <div className="relative max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7088aa]" />
                                <Input
                                    placeholder="Search jobs..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-9 border-[#a8bdda] focus:border-[#001145]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jobs Grid */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#f6faff] rounded-xl p-5 animate-pulse"
                                    >
                                        <div className="h-5 bg-[#e4f0ff] rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-[#e4f0ff] rounded w-1/2 mb-4"></div>
                                        <div className="h-3 bg-[#e4f0ff] rounded w-full mb-2"></div>
                                        <div className="h-3 bg-[#e4f0ff] rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-[#001145] flex items-center justify-center">
                                    <Briefcase
                                        size={28}
                                        className="text-white"
                                    />
                                </div>
                                <p className="text-[#001145] text-lg font-semibold">
                                    No jobs found
                                </p>
                                <p className="text-[#7088aa] text-sm mt-1">
                                    Try adjusting your search or create a new
                                    job
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredJobs.map((job, index) => (
                                    <div
                                        key={job._id}
                                        className="bg-[#f6faff] rounded-xl p-5 border border-[#e4f0ff] hover:border-[#a8bdda] hover:shadow-lg transition-all group"
                                    >
                                        {/* Job Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                                style={{
                                                    backgroundColor:
                                                        SARTHAK_CHART_COLORS[
                                                            index % 5
                                                        ],
                                                }}
                                            >
                                                {job.company[0]?.toUpperCase()}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setIsViewDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                    className="p-2 hover:bg-[#e4f0ff] rounded-lg transition-colors"
                                                >
                                                    <Eye
                                                        size={16}
                                                        className="text-[#4a5f7c]"
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Job Info */}
                                        <h3 className="font-bold text-[#001145] text-lg mb-1 line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-[#4a5f7c] text-sm mb-3">
                                            {job.company}
                                        </p>

                                        {/* Meta info */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2.5 py-1 bg-[#001145] text-white text-xs font-semibold rounded-full">
                                                {job.type === "full-time"
                                                    ? "Full-time"
                                                    : "Internship"}
                                            </span>
                                            {job.location && (
                                                <span className="px-2.5 py-1 bg-[#e4f0ff] text-[#001145] text-xs font-medium rounded-full flex items-center gap-1">
                                                    <MapPin size={10} />{" "}
                                                    {job.location}
                                                </span>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1">
                                            {job.skillsRequired
                                                ?.slice(0, 3)
                                                .map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 bg-white border border-[#a8bdda] text-[#4a5f7c] text-xs rounded-md"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {job.skillsRequired?.length > 3 && (
                                                <span className="px-2 py-0.5 bg-[#7088aa] text-white text-xs rounded-md">
                                                    +
                                                    {job.skillsRequired.length -
                                                        3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-[#e4f0ff] text-[#7088aa] text-xs">
                                            <Clock size={12} />
                                            {new Date(
                                                job.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* View Dialog */}
                <Dialog
                    open={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                >
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-[#001145]">
                                {selectedJob?.title}
                            </DialogTitle>
                            <DialogDescription className="text-[#7088aa]">
                                {selectedJob?.company}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedJob && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-[#001145] text-white text-sm font-semibold rounded-full">
                                        {selectedJob.type === "full-time"
                                            ? "Full-time"
                                            : "Internship"}
                                    </span>
                                    <span className="px-3 py-1 bg-[#e4f0ff] text-[#001145] text-sm font-medium rounded-full">
                                        {selectedJob.location || "Remote"}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#7088aa]">
                                        Description
                                    </label>
                                    <p className="text-sm text-[#001145] mt-1">
                                        {selectedJob.description ||
                                            "No description provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#7088aa]">
                                        Skills Required
                                    </label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedJob.skillsRequired?.map(
                                            (skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-[#e4f0ff] text-[#001145] text-xs font-semibold rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#7088aa]">
                                        Posted On
                                    </label>
                                    <p className="text-sm text-[#001145]">
                                        {new Date(
                                            selectedJob.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#001145]">
                                Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#7088aa]">
                                This action cannot be undone. This will
                                permanently delete the job posting.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#a8bdda]">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </PageLayout>
    );
}
