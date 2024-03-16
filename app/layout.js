"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModelStatusProvider } from "@/components/context/ModelStatusContext";
import { NewChatProvider } from "@/components/context/NewChatContext";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "react-notifications/lib/notifications.css";
import "./globals.css";
import "./contexify.css";
import { GOOGLE_CLIENT_ID } from "@/config";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });
const nasalization = localFont({
  src: "./nasalization-rg.otf",
  variable: "--font-nasalization",
});
const montserrat = localFont({
  src: "./Montserrat-Regular.ttf",
  variable: "--font-montserrat",
});
const helvetica = localFont({
  src: "./Helvetica.ttf",
  variable: "--font-helvetica",
});
const helvetica_neue = localFont({
  src: "./Helvetica Neue.otf",
  variable: "--font-helvetica_neue",
});

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token") == null) router.push("/register");
    // router.push("/sign");
  }, []);

  return (
    <html lang="en">
      <title>Einstein</title>
      <body
        className={`${nasalization.variable} ${montserrat.variable} ${helvetica.variable} ${helvetica_neue.variable}`}
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ModelStatusProvider>
            <NewChatProvider>{children}</NewChatProvider>
          </ModelStatusProvider>
        </GoogleOAuthProvider>
        ;
      </body>
    </html>
  );
}
