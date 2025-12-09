"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        if (token) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
            Redirecting...
        </div>
    );
}
