import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import App from "./app";
import StoreProvider from "./StoreProvider";
import "react-toastify/dist/ReactToastify.css";
import "animate.css/animate.min.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Tic-tac-toe Game",
    description: "Game Cờ Ca-rô",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <StoreProvider>
                    <App>{children}</App>
                </StoreProvider>
            </body>
        </html>
    );
}
