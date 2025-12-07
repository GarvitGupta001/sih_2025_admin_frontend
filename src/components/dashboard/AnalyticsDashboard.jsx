"use client";

import React, { useMemo } from "react";
import {
    Users,
    CheckCircle,
    UserCheck,
    Briefcase,
    ChevronDown,
    User,
    ShieldCheck,
} from "lucide-react";
import GlassCard from "./GlassCard";
import DepartmentDistributionChart from "./DepartmentDistributionChart";
import GraduationYearTrendsChart from "./GraduationYearTrendsChart";

export default function AnalyticsDashboard({
    totalAlumni,
    verifiedAlumni,
    profileCompletion,
    employmentRate,
    alumni = [],
}) {
    // Safe calculation for display stats
    const verificationPercentage =
        totalAlumni > 0
            ? ((verifiedAlumni / totalAlumni) * 100).toFixed(1)
            : "0.0";
    const completeProfiles = Math.round(
        (profileCompletion * totalAlumni) / 100
    );
    const employedCount = Math.round((employmentRate * totalAlumni) / 100);

    // CHANGE: Flatten the data structure for the charts.
    // This ensures that if the charts expect "department" at the root level,
    // they find it (instead of it being hidden inside profileDetails).
    const chartData = useMemo(() => {
        return alumni.map((item) => {
            const details = item.profileDetails || {};
            return {
                ...item, // Keep root fields like name, email, _id
                ...details, // Spread nested details (department, graduationYear, etc.) to the top level
                // Explicitly ensure critical fields exist if needed by charts
                department: details.department || "Unknown",
                graduationYear: details.graduationYear || "N/A",
            };
        });
    }, [alumni]);

    return (
        <div className="p-8 bg-white font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-[#030e29]">
                    Analytics Dashboard
                </h2>
                <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-[#030e29] transition-colors">
                    <span>Last 7 days</span>
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* --- Top Cards Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {/* --- Card 1: Total Alumni --- */}
                <GlassCard
                    className="w-full aspect-[4/3.5]"
                    vector1Class="text-blue-200"
                    vector2Class="text-blue-100"
                >
                    {/* Top: Title & Icon */}
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-[#030e29] text-m mt-1">
                            Total Alumni
                        </span>
                        <div className="p-2 bg-[#030e29]/5 rounded-full">
                            <Users size={18} className="text-[#030e29]" />
                        </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="flex flex-col mt-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-[#030e29]">
                                {totalAlumni}
                            </span>
                        </div>
                        <p className="text-[14px] font-medium text-[#030e29]/50">
                            Overall registered
                        </p>
                    </div>

                    {/* Bottom: Chart & Ghost Icon */}
                    <div className="mt-auto flex justify-between items-end w-full">
                        {/* Bar Chart */}
                        <div className="flex items-end gap-1.5 h-8">
                            {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 rounded-sm ${
                                        i % 2 === 0
                                            ? "bg-[#030e29]/40"
                                            : "bg-[#030e29]/20"
                                    }`}
                                    style={{ height: `${h}%` }}
                                ></div>
                            ))}
                        </div>
                        {/* Ghost Icon (Bottom Right) */}
                        <Users size={20} className="text-[#030e29]/20 mb-1" />
                    </div>
                </GlassCard>

                {/* --- Card 2: Verified Alumni --- */}
                <GlassCard
                    className="w-full aspect-[4/3.5]"
                    vector1Class="text-blue-200"
                    vector2Class="text-blue-100"
                >
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-[#030e29] text-m mt-1">
                            Verified Alumni
                        </span>
                        <div className="p-2 bg-[#030e29]/5 rounded-full">
                            <CheckCircle size={18} className="text-[#030e29]" />
                        </div>
                    </div>

                    <div className="flex flex-col mt-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-[#030e29]">
                                {verifiedAlumni}
                            </span>
                        </div>
                        <p className="text-[14px] font-medium text-[#030e29]/50">
                            {verificationPercentage}% verified
                        </p>
                    </div>

                    <div className="mt-auto flex justify-between items-end w-full">
                        {/* Progress Bar */}
                        <div className="h-1.5 w-24 bg-[#030e29]/10 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-[#030e29] rounded-full"
                                style={{ width: `${verificationPercentage}%` }}
                            ></div>
                        </div>
                        <ShieldCheck
                            size={20}
                            className="text-[#030e29]/20 mb-1"
                        />
                    </div>
                </GlassCard>

                {/* --- Card 3: Profile Completion --- */}
                <GlassCard
                    className="w-full aspect-[4/3.5]"
                    vector1Class="text-blue-200"
                    vector2Class="text-blue-100"
                >
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-[#030e29] text-m mt-1">
                            Profile Completion
                        </span>
                        <div className="p-2 bg-[#030e29]/5 rounded-full">
                            <UserCheck size={18} className="text-[#030e29]" />
                        </div>
                    </div>

                    <div className="flex flex-col mb-4 mt-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-[#030e29]">
                                {profileCompletion.toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-[14px] font-medium text-[#030e29]/50">
                            {completeProfiles} complete profiles
                        </p>
                    </div>

                    <div className="mt-auto flex justify-between items-end w-full">
                        {/* Progress Bar */}
                        <div className="h-1.5 w-24 bg-[#030e29]/10 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-[#030e29] rounded-full"
                                style={{ width: `${profileCompletion}%` }}
                            ></div>
                        </div>
                        <User size={20} className="text-[#030e29]/20 mb-1" />
                    </div>
                </GlassCard>

                {/* --- Card 4: Employment Rate --- */}
                <GlassCard
                    className="w-full aspect-[4/3.5]"
                    vector1Class="text-blue-200"
                    vector2Class="text-blue-100"
                >
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-[#030e29] text-m mt-1">
                            Employment Rate
                        </span>
                        <div className="p-2 bg-[#030e29]/5 rounded-full">
                            <Briefcase size={18} className="text-[#030e29]" />
                        </div>
                    </div>

                    <div className="flex flex-col mt-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-[#030e29]">
                                {employmentRate.toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-[14px] font-medium text-[#030e29]/50">
                            {employedCount} currently employed
                        </p>
                    </div>

                    <div className="mt-auto flex justify-between items-end w-full">
                        {/* Progress Bar */}
                        <div className="h-1.5 w-24 bg-[#030e29]/10 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-[#030e29] rounded-full"
                                style={{ width: `${employmentRate}%` }}
                            ></div>
                        </div>
                        <Briefcase
                            size={20}
                            className="text-[#030e29]/20 mb-1"
                        />
                    </div>
                </GlassCard>
            </div>

            {/* --- Bottom Charts Grid --- */}
            <div className="grid grid-cols-1 mt-24 lg:grid-cols-2 gap-6">
                {/* CHANGE: Pass chartData (flattened) instead of raw alumni */}
                <DepartmentDistributionChart alumni={chartData} />
                <GraduationYearTrendsChart alumni={chartData} />
            </div>
        </div>
    );
}
