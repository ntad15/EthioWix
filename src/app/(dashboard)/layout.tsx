import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EthioWix — Dashboard",
  description: "Manage your hospitality website",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
