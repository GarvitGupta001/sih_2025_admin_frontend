"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import TopSkillsChart from "@/components/dashboard/TopSkillsChart";
import RecentActivityWidget from "@/components/dashboard/RecentActivityWidget";
import Header from "@/components/dashboard/Header";
import Navbar from "@/components/dashboard/Navbar";

const Dashboard = () => {
    const [token, setToken] = useState("");
    const [alumni, setAlumni] = useState([]);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const totalAlumni = alumni.length;

    // CHANGE: specific verified check accessing profileDetails safely
    const verifiedAlumni = alumni.filter(
        (a) => a.profileDetails?.verified
    ).length;

    // CHANGE: Updated calculation logic for new JSON structure
    const profileCompletion =
        alumni.length > 0
            ? alumni.reduce((acc, a) => {
                  let completedFields = 0;
                  const totalFields = 10;

                  // Access nested details safely
                  const details = a.profileDetails || {};

                  // Check Root level fields
                  if (a.name) completedFields++;
                  if (a.email) completedFields++;

                  // Check Nested profileDetails fields
                  if (details.department) completedFields++;
                  if (details.graduationYear) completedFields++;
                  if (details.currentCompany) completedFields++;
                  // 'designation' is the new key (was jobTitle)
                  if (details.designation || details.jobTitle)
                      completedFields++;
                  if (details.location) completedFields++;

                  const skills = details.skills || [];
                  if (Array.isArray(skills) && skills.length > 0)
                      completedFields++;

                  if (details.bio) completedFields++;
                  if (details.linkedIn || details.github) completedFields++;

                  return acc + (completedFields / totalFields) * 100;
              }, 0) / alumni.length
            : 0;

    // CHANGE: Check currentCompany inside profileDetails
    const employmentRate =
        alumni.length > 0
            ? (alumni.filter((a) => a.profileDetails?.currentCompany).length /
                  alumni.length) *
              100
            : 0;

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
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
            {/* Header with Language Switcher */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center w-full mt-8">
                {/* Navigation Bar */}
                <Navbar />

                {/* Building Sketch */}
                <div className="w-full max-w-7xl">
                    <img
                        src="/fot_blue.png"
                        alt="Faculty of Technology Building Sketch"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Analytics Dashboard with Real Data */}
                <div className="w-full mt-10 mb-18 px-4 sm:px-6 lg:px-8">
                    <AnalyticsDashboard
                        totalAlumni={totalAlumni}
                        verifiedAlumni={verifiedAlumni}
                        profileCompletion={profileCompletion}
                        employmentRate={employmentRate}
                        alumni={alumni}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 flex justify-center items-center bg-white border-t border-[#dbeaff]">
                <p className="text-[#001145] font-bold text-[11px] tracking-wide opacity-40">
                    Sarthak © 2025 | Built at SIH | De-bugs_
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
