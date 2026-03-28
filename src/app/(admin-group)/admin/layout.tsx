import React from 'react';
import type { Metadata } from "next";
import AdminShell from './components/AdminShell';

export const metadata: Metadata = {
  title: "Admin | Stan Grace Properties LTD",
  description: "Admin dashboard for Stan Grace Properties LTD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}