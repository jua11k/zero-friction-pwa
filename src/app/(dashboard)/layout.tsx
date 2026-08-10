import { auth } from "@/../auth";
import { getTenantProfile } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const tenant = await getTenantProfile(session.user.email);
  
  // If tenant has no business configuration, force onboarding
  if (!tenant || !tenant.name || tenant.name.trim() === "" || tenant.businessTypeId === null) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
