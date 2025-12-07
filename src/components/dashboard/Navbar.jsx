import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#030e29] text-white rounded-full px-8 py-4 shadow-lg mb-12">
      <ul className="flex items-center gap-6 text-sm font-bold tracking-wide flex-wrap justify-center">
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/alumni">Alumni</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/students">Students</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/jobs">Jobs</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/events">Events</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/campaigns">Campaigns</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/surveys">Surveys</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/success-stories">Stories</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/posts">Posts</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/newsletters">Newsletters</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-300 transition-colors">
          <Link href="/analytics">Analytics</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
