"use client";

import React, { useEffect, useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "A" },
  { code: "hi", label: "अ" },
  { code: "pa", label: "ਮ" },
];

const Header = () => {
  // SSR always loads "en" → no mismatch
  const [active, setActive] = useState("en");

  // After hydration, update based on localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setActive(saved);
  }, []);

  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }

    setActive(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <header className="flex justify-between items-center px-6 py-2 border-b border-gray-100 bg-white">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/fot_logo.png"
          alt="Faculty of Technology Logo"
          className="h-14 object-contain"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Language Switch - notranslate prevents Google from translating these labels */}
        <div className="notranslate flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`notranslate px-3 py-1 rounded-full text-sm font-semibold transition-all
                ${active === lang.code
                  ? "bg-white text-black shadow"
                  : "text-gray-500 hover:text-black"
                }
              `}
            >
              <span className="notranslate">{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={24} />
        </button>

        {/* User Dropdown with Logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={24} className="text-gray-400" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};

export default Header;

