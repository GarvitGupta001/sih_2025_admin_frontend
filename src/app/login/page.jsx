"use client";

import axios from "axios";
import Image from "next/image";
import {
    BookOpen,
    Calendar,
    LayoutDashboard,
    Lock,
    Mail,
    Users,
} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";

const Login = () => {
    const router = useRouter();
     
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });
            console.log(response.data);
            localStorage.setItem("token", response.data.data.token);
            router.push("/dashboard");
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

   

    return (
        <>
            {/* ANIMATIONS */}
            <style jsx global>{`
                @keyframes spin-slow {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 1.8s linear infinite;
                }

                @keyframes fadeInCentered {
                    from {
                        opacity: 0;
                        transform: scale(0.85);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeInCentered {
                    animation: fadeInCentered 0.5s ease-out forwards;
                }
            `}</style>

            {/* =============================== */}
            {/* 1) GLOBAL WHITE LOADING UI     */}
            {/* =============================== */}
            {(loading) && (
                <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50 animate-fadeInCentered">
                    {/* Circle Loader */}
                    <div className="relative w-48 h-48 mb-6">
                        <div className="absolute inset-0 border-4 border-transparent border-t-[#001245] border-r-[#001245] rounded-full animate-spin-slow"></div>

                        {/* Institute Logo In Center */}
                        <div className="absolute inset-0 m-auto w-[184px] h-[184px] flex items-center justify-center">
                            <Image
                                src="/du.png"
                                alt="Institute Logo"
                                width={184}
                                height={184}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <p className="text-slate-600 text-sm tracking-wide">
                        Logging you in...
                    </p>
                </div>
            )}

            {/* =============================== */}
            {/* 2) NORMAL LOGIN UI         */}
            {/* =============================== */}
            {!loading && (
                <div className="min-h-screen w-full flex bg-white font-sans text-slate-800">
                    {/* LEFT SIDE — Logo + Form */}
                    <div className="w-1/2 flex flex-col items-center justify-center px-12 bg-[#f6faff]">
                        {/* Logo */}
                        <Image
                            src="/sarthak_clear.png"
                            alt="Sarthak Logo"
                            width={330}
                            height={80}
                            className="object-contain mb-4"
                        />

                        {/* FORM */}
                        <div className="w-full max-w-sm mt-6">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                Welcome Back!
                            </h2>

                            <p className="text-sm text-slate-500 mb-6">
                                Sign in to access your institution dashboard.
                            </p>

                            <p className="text-sm font-semibold text-slate-800 mb-6">
                                Admin Login • Sarthak
                            </p>

                            <form className="space-y-5" onSubmit={handleLogin}>
                                {/* Email */}
                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-3 text-slate-400"
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your admin email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl"
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-3 text-slate-400"
                                    />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl"
                                    />
                                </div>

                                {/* Options */}
                                <div className="flex items-center justify-between text-xs text-slate-700">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-3 h-3"
                                        />
                                        Remember Me
                                    </label>
                                    <a href="#" className="hover:underline">
                                        Forgot Password?
                                    </a>
                                </div>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="block w-40 mx-auto bg-slate-900 text-white font-bold py-2.5 rounded-full hover:bg-slate-800 transition shadow-md"
                                >
                                    Sign In
                                </button>
                            </form>

                            {/* Bottom Link */}
                            <p className="text-center text-xs text-slate-600 mt-8">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="#"
                                    className="font-bold text-slate-900 hover:underline"
                                >
                                    Register Institution
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE — FEATURES GRID (FIXED LAYOUT) */}
                    <div className="w-1/2 flex flex-col px-14 bg-white relative">
                        {/* 1. Main Content Wrapper: Takes available space and centers content */}
                        <div className="flex-1 flex flex-col justify-center z-10">
                            <h1 className="text-4xl font-bold mb-3">
                                Manage Smarter with Sarthak
                            </h1>
                            <p className="text-slate-500 text-sm mb-10">
                                Tools crafted for seamless institutional
                                administration.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: <LayoutDashboard size={22} />,
                                        title: "Dashboard",
                                    },
                                    {
                                        icon: <Users size={22} />,
                                        title: "Alumni Directory",
                                    },
                                    {
                                        icon: <Calendar size={22} />,
                                        title: "Event Platform",
                                    },
                                    {
                                        icon: <BookOpen size={22} />,
                                        title: "Resource Center",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="p-3 bg-blue-100 text-[#001245] rounded-lg w-fit mb-2">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-semibold text-base text-slate-800">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item.title === "Dashboard" &&
                                                "Control your institution ecosystem."}
                                            {item.title ===
                                                "Alumni Directory" &&
                                                "Search & manage verified alumni."}
                                            {item.title === "Event Platform" &&
                                                "Organize and track alumni events."}
                                            {item.title === "Resource Center" &&
                                                "Access institutional tools & materials."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Footer: No longer absolute, sits naturally at the bottom */}
                        <div className="py-6 text-center w-full z-10">
                            <p className="text-[10px] text-slate-400 tracking-wider font-medium opacity-80">
                                Sarthak © 2025 • Built at SIH • De-bugs_
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
