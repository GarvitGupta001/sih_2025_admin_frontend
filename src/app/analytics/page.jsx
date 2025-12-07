"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
    Users,
    MapPin,
    Building2,
    GraduationCap,
    TrendingUp,
    Briefcase,
    Globe,
    RefreshCw,
    Filter,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

import PageLayout from "@/components/dashboard/PageLayout";
import DepartmentDistributionChart from "@/components/dashboard/DepartmentDistributionChart";
import GraduationYearTrendsChart from "@/components/dashboard/GraduationYearTrendsChart";
import { SARTHAK_THEME, SARTHAK_CHART_COLORS } from "@/lib/theme";
import axios from "axios";

// Dynamic import for Map component (Leaflet doesn't work with SSR)
const AlumniMapComponent = dynamic(
    () => import("@/components/analytics/AlumniMap"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] bg-[#f6faff] border border-[#e4f0ff] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <Globe className="h-12 w-12 text-[#7088aa] mx-auto mb-3 animate-pulse" />
                    <p className="text-[#7088aa]">Loading map...</p>
                </div>
            </div>
        ),
    }
);

export default function AnalyticsPage() {
    const token = localStorage.getItem("token");
    const [alumni, setAlumni] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState("overview");
    const [mapFilter, setMapFilter] = React.useState({
        company: "All",
        batch: "All",
    });

    React.useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            // Fixed URL string interpolation closing brace typo from original code
            const response = axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/alumni`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Wait for the promise to resolve
            const res = await response;
            setAlumni(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate analytics
    const analytics = React.useMemo(() => {
        const total = alumni.length;

        // CHANGE: Access verified from profileDetails
        const verified = alumni.filter(
            (a) => a.profileDetails?.verified
        ).length;

        // CHANGE: Access employment info from profileDetails
        const employed = alumni.filter((a) => {
            const details = a.profileDetails || {};
            return (
                details.employmentStatus === "employed" ||
                details.currentCompany
            );
        }).length;

        // Department distribution
        const deptMap = {};
        alumni.forEach((a) => {
            // CHANGE: Access from profileDetails
            const details = a.profileDetails || {};
            const dept = details.department || "Unknown";
            deptMap[dept] = (deptMap[dept] || 0) + 1;
        });
        const departments = Object.entries(deptMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Graduation year trends
        const yearMap = {};
        alumni.forEach((a) => {
            // CHANGE: Access from profileDetails
            const details = a.profileDetails || {};
            if (details.graduationYear) {
                yearMap[details.graduationYear] =
                    (yearMap[details.graduationYear] || 0) + 1;
            }
        });
        const gradTrends = Object.entries(yearMap)
            .map(([year, count]) => ({ year: parseInt(year), count }))
            .sort((a, b) => a.year - b.year);

        // Company distribution
        const companyMap = {};
        alumni.forEach((a) => {
            // CHANGE: Access from profileDetails
            const details = a.profileDetails || {};
            if (details.currentCompany) {
                companyMap[details.currentCompany] =
                    (companyMap[details.currentCompany] || 0) + 1;
            }
        });
        const topCompanies = Object.entries(companyMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

        // Location distribution
        const cityMap = {};
        alumni.forEach((a) => {
            // CHANGE: Access from profileDetails
            const details = a.profileDetails || {};
            if (details.location?.city) {
                cityMap[details.location.city] =
                    (cityMap[details.location.city] || 0) + 1;
            }
        });
        const topCities = Object.entries(cityMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);

        // Degree distribution
        const degreeMap = {};
        alumni.forEach((a) => {
            // CHANGE: Access from profileDetails
            const details = a.profileDetails || {};
            const degree = details.degree || "Unknown";
            degreeMap[degree] = (degreeMap[degree] || 0) + 1;
        });
        const degrees = Object.entries(degreeMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Map data (alumni with coordinates)
        const mapData = alumni
            .filter((a) => {
                // CHANGE: Access location from profileDetails
                const details = a.profileDetails || {};
                return (
                    details.location?.coordinates?.lat &&
                    details.location?.coordinates?.lng
                );
            })
            .map((a) => {
                // CHANGE: Access details for specific fields, use Root for name
                const details = a.profileDetails || {};
                return {
                    id: a._id,
                    name: a.name || "Alumni", // Root level
                    graduation_year: details.graduationYear,
                    company: details.currentCompany || "N/A",
                    role: details.designation || "N/A",
                    city: details.location?.city || "",
                    state: details.location?.state || "",
                    display_point: {
                        lat: details.location?.coordinates?.lat,
                        lng: details.location?.coordinates?.lng,
                    },
                };
            });

        return {
            total,
            verified,
            pending: total - verified,
            employed,
            employmentRate: total ? Math.round((employed / total) * 100) : 0,
            departments,
            gradTrends,
            topCompanies,
            topCities,
            degrees,
            mapData,
        };
    }, [alumni]);

    // Get unique values for map filters
    const uniqueCompanies = React.useMemo(() => {
        const set = new Set(
            analytics.mapData.map((a) => a.company).filter((c) => !!c)
        );
        return ["All", ...Array.from(set).sort()];
    }, [analytics.mapData]);

    const uniqueBatches = React.useMemo(() => {
        const set = new Set(
            analytics.mapData
                .map((a) => a.graduation_year?.toString())
                .filter((b) => !!b)
        );
        return [
            "All",
            ...Array.from(set).sort((a, b) => parseInt(b) - parseInt(a)),
        ];
    }, [analytics.mapData]);

    const filteredMapData = React.useMemo(() => {
        return analytics.mapData.filter((a) => {
            if (mapFilter.company !== "All" && a.company !== mapFilter.company)
                return false;
            if (
                mapFilter.batch !== "All" &&
                String(a.graduation_year) !== mapFilter.batch
            )
                return false;
            return true;
        });
    }, [analytics.mapData, mapFilter]);

    // Convert alumni to expected type for dashboard components
    // CHANGE: Flatten the data structure for child components
    const alumniForCharts = React.useMemo(() => {
        return alumni.map((item) => {
            const details = item.profileDetails || {};
            return {
                ...item,
                ...details, // Spread details to root level for legacy chart components
            };
        });
    }, [alumni]);

    return (
        <PageLayout>
            <div className="min-h-screen bg-white p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#001145]">
                            Analytics Dashboard
                        </h1>
                        <p className="text-[#7088aa] mt-2">
                            Comprehensive insights into your alumni network
                        </p>
                    </div>
                    <button
                        onClick={fetchAlumni}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#001145] hover:bg-[#001439] text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh Data
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 bg-[#f6faff] p-1.5 rounded-2xl border border-[#e4f0ff] shadow-sm w-fit">
                    {["overview", "map", "charts"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === tab
                                    ? "bg-[#001145] text-white shadow-lg"
                                    : "text-[#7088aa] hover:text-[#001145] hover:bg-[#e4f0ff]"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="bg-[#f6faff] rounded-3xl border border-[#e4f0ff] shadow-xl p-16 text-center">
                        <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-[#7088aa]" />
                        <p className="text-[#7088aa] text-lg">
                            Loading analytics data...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={Users}
                                        label="Total Alumni"
                                        value={analytics.total}
                                        trend="+12%"
                                        bgColor="#7088aa"
                                    />
                                    <StatCard
                                        icon={GraduationCap}
                                        label="Verified Alumni"
                                        value={analytics.verified}
                                        subLabel={`${analytics.pending} pending`}
                                        bgColor="#7088aa"
                                    />
                                    <StatCard
                                        icon={Briefcase}
                                        label="Employment Rate"
                                        value={`${analytics.employmentRate}%`}
                                        subLabel={`${analytics.employed} employed`}
                                        bgColor="#7088aa"
                                    />
                                    <StatCard
                                        icon={MapPin}
                                        label="Locations Tracked"
                                        value={analytics.mapData.length}
                                        subLabel="On the map"
                                        bgColor="#7088aa"
                                    />
                                </div>

                                {/* Use Dashboard Components for Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <DepartmentDistributionChart
                                        alumni={alumniForCharts}
                                    />
                                    <GraduationYearTrendsChart
                                        alumni={alumniForCharts}
                                    />
                                </div>

                                {/* Map Preview */}
                                <ChartCard
                                    title="Alumni Geographic Distribution"
                                    icon={Globe}
                                    fullWidth
                                >
                                    <div className="h-[400px]">
                                        <AlumniMapComponent
                                            alumni={analytics.mapData.slice(
                                                0,
                                                50
                                            )}
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setActiveTab("map")}
                                            className="text-[#001145] hover:text-[#4a5f7c] font-semibold text-sm"
                                        >
                                            View Full Map
                                        </button>
                                    </div>
                                </ChartCard>
                            </div>
                        )}

                        {/* Map Tab */}
                        {activeTab === "map" && (
                            <div className="space-y-6">
                                {/* Map Filters */}
                                <div className="bg-[#f6faff] p-5 rounded-2xl border border-[#e4f0ff] shadow-lg">
                                    <div className="flex items-center gap-6 flex-wrap">
                                        <div className="flex items-center gap-2 text-[#001145] font-semibold">
                                            <Filter size={18} />
                                            Filter Map
                                        </div>
                                        <div className="flex gap-4 flex-wrap">
                                            <select
                                                className="px-4 py-2.5 bg-white border border-[#a8bdda] rounded-xl text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] transition-colors"
                                                value={mapFilter.company}
                                                onChange={(e) =>
                                                    setMapFilter({
                                                        ...mapFilter,
                                                        company: e.target.value,
                                                    })
                                                }
                                            >
                                                {uniqueCompanies.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c === "All"
                                                            ? "All Companies"
                                                            : c}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                className="px-4 py-2.5 bg-white border border-[#a8bdda] rounded-xl text-sm text-[#4a5f7c] focus:outline-none focus:border-[#001145] transition-colors"
                                                value={mapFilter.batch}
                                                onChange={(e) =>
                                                    setMapFilter({
                                                        ...mapFilter,
                                                        batch: e.target.value,
                                                    })
                                                }
                                            >
                                                {uniqueBatches.map((b) => (
                                                    <option key={b} value={b}>
                                                        {b === "All"
                                                            ? "All Batches"
                                                            : `Batch ${b}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="ml-auto text-sm text-[#7088aa]">
                                            Showing {filteredMapData.length} of{" "}
                                            {analytics.mapData.length} alumni
                                        </div>
                                    </div>
                                </div>

                                {/* Full Map */}
                                <div className="bg-white rounded-2xl border border-[#e4f0ff] shadow-lg overflow-hidden">
                                    <div className="h-[600px]">
                                        <AlumniMapComponent
                                            alumni={filteredMapData}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Charts Tab */}
                        {activeTab === "charts" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Top Hiring Companies */}
                                    <ChartCard
                                        title="Top Hiring Companies"
                                        icon={Building2}
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={analytics.topCompanies}
                                                layout="vertical"
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e4f0ff"
                                                    horizontal={true}
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    type="number"
                                                    stroke="#7088aa"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={100}
                                                    stroke="#4a5f7c"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#001145",
                                                        border: "1px solid #4a5f7c",
                                                        borderRadius: "12px",
                                                    }}
                                                    labelStyle={{
                                                        color: "#a8bdda",
                                                    }}
                                                    itemStyle={{
                                                        color: "#ffffff",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    radius={[0, 4, 4, 0]}
                                                >
                                                    {analytics.topCompanies.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    SARTHAK_CHART_COLORS[
                                                                        index %
                                                                            SARTHAK_CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartCard>

                                    {/* Degree Distribution */}
                                    <ChartCard
                                        title="Degree Distribution"
                                        icon={GraduationCap}
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={analytics.degrees}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    innerRadius={50}
                                                    stroke="#f6faff"
                                                    strokeWidth={2}
                                                >
                                                    {analytics.degrees.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    SARTHAK_CHART_COLORS[
                                                                        index %
                                                                            SARTHAK_CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#001145",
                                                        border: "1px solid #4a5f7c",
                                                        borderRadius: "12px",
                                                    }}
                                                    labelStyle={{
                                                        color: "#a8bdda",
                                                    }}
                                                    itemStyle={{
                                                        color: "#ffffff",
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartCard>

                                    {/* Top Alumni Locations */}
                                    <ChartCard
                                        title="Top Alumni Locations"
                                        icon={MapPin}
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={analytics.topCities}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e4f0ff"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#4a5f7c"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fontSize: 11 }}
                                                />
                                                <YAxis
                                                    stroke="#7088aa"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#001145",
                                                        border: "1px solid #4a5f7c",
                                                        borderRadius: "12px",
                                                    }}
                                                    labelStyle={{
                                                        color: "#a8bdda",
                                                    }}
                                                    itemStyle={{
                                                        color: "#ffffff",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    radius={[4, 4, 0, 0]}
                                                >
                                                    {analytics.topCities.map(
                                                        (_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    SARTHAK_CHART_COLORS[
                                                                        index %
                                                                            SARTHAK_CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartCard>

                                    {/* Alumni Growth Trend */}
                                    <ChartCard
                                        title="Alumni Growth Trend"
                                        icon={TrendingUp}
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <LineChart
                                                data={analytics.gradTrends}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e4f0ff"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="year"
                                                    stroke="#4a5f7c"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#7088aa"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#001145",
                                                        border: "1px solid #4a5f7c",
                                                        borderRadius: "12px",
                                                    }}
                                                    labelStyle={{
                                                        color: "#a8bdda",
                                                    }}
                                                    itemStyle={{
                                                        color: "#ffffff",
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="count"
                                                    stroke="#001145"
                                                    strokeWidth={3}
                                                    dot={{
                                                        fill: "#001145",
                                                        strokeWidth: 2,
                                                        r: 6,
                                                        stroke: "#f6faff",
                                                    }}
                                                    activeDot={{
                                                        r: 8,
                                                        fill: "#001439",
                                                        stroke: "#f6faff",
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </ChartCard>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
}

// Stat Card Component - Sarthak Theme (no gradients)
function StatCard({ icon: Icon, label, value, trend, subLabel, bgColor }) {
    return (
        <div className="bg-white rounded-2xl border border-[#e4f0ff] shadow-lg hover:shadow-xl transition-all p-6 group">
            <div className="flex items-start justify-between">
                <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: bgColor }}
                >
                    <Icon className="h-7 w-7 text-white" />
                </div>
                {trend && (
                    <span className="px-3 py-1 bg-[#e4f0ff] text-[#001145] text-xs font-bold rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm text-[#7088aa] font-medium">{label}</p>
                <p className="text-3xl font-bold text-[#001145] mt-1">
                    {value}
                </p>
                {subLabel && (
                    <p className="text-xs text-[#a8bdda] mt-1">{subLabel}</p>
                )}
            </div>
        </div>
    );
}

// Chart Card Component - Sarthak Theme (no gradients)
function ChartCard({ title, icon: Icon, children, fullWidth }) {
    return (
        <div
            className={`bg-white rounded-2xl border border-[#e4f0ff] shadow-lg p-6 ${
                fullWidth ? "col-span-full" : ""
            }`}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#001145] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#001145]">{title}</h3>
            </div>
            {children}
        </div>
    );
}
