"use client";

import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout({ children, showBuilding = false }) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full mt-8">
        {/* Navigation Bar */}
        <Navbar />

        {/* Building Sketch - Optional */}
        {showBuilding && (
          <div className="w-full max-w-7xl">
            <img
              src="/fot_blue.png"
              alt="Faculty of Technology Building Sketch"
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Page Content */}
        <div className="w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
