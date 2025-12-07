"use client";

import { SARTHAK_THEME } from "@/lib/theme";

/**
 * Sarthak Theme Stat Card
 * - Light blue box background (#f6faff)
 * - Very subtle icon with light background (#e4f0ff) that blends with box
 * - Icon color is muted (#4a5f7c)
 */
export default function SarthakStatCard({
    title,
    value,
    subtitle,
    icon
}) {
    return (
        <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[#7088aa] text-sm font-medium">{title}</span>
                <div className="p-2 bg-[#e4f0ff] rounded-xl text-[#4a5f7c]">
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-extrabold text-[#001145]">{value}</p>
            {subtitle && (
                <p className="text-[#7088aa] text-sm mt-1">{subtitle}</p>
            )}
        </div>
    );
}
