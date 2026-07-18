import React from "react";
import "../styles/globals.css";

export const metadata = {
    title: "StadiumPulse — FIFA World Cup GenAI Command Hub",
    description: "GenAI-powered operational intelligence and mobile fan concierge platform for MetLife Stadium, FIFA World Cup.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}