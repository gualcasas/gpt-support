import { ReactNode } from "react";
import { Chat } from "./_components/Chat";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Bookbuddy",
    description: "Your bookstore for fantasy & mistery novels",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Chat />
                {children}
            </body>
        </html>
    );
}
