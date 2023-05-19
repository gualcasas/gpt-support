import { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Chat } from "@/components/Chat";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Bookbuddy",
    description: "Your bookstore for fantasy & mistery novels",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Chat />
                </Providers>
            </body>
        </html>
    );
}
