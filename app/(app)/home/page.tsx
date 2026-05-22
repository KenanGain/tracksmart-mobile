import type { Metadata } from "next";
import { getCompany, getPayrolls, getShifts } from "@/lib/api/home";
import { getComplianceSummary } from "@/lib/api/compliance";
import { CompanyCard } from "@/components/home/CompanyCard";
import { ComplianceCard } from "@/components/home/ComplianceCard";
import { ActionCard } from "@/components/home/ActionCard";
import { LinkCard } from "@/components/home/LinkCard";
import { TimeTrackingCard } from "@/components/home/TimeTrackingCard";
import { HomeMenu } from "@/components/home/HomeMenu";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const [company, compliance, payrolls, shifts] = await Promise.all([
    getCompany(),
    getComplianceSummary(),
    getPayrolls(),
    getShifts(),
  ]);

  return (
    <div className="space-y-4">
      <CompanyCard company={company} />
      <ComplianceCard summary={compliance} />

      <ActionCard
        title="Expenses"
        actions={[
          { icon: "plus", label: "Submit New", href: "/expenses/new" },
          { icon: "menu", label: "Status", href: "/expenses" },
        ]}
      />
      <ActionCard
        title="Maintenance Requests"
        actions={[
          { icon: "plus", label: "New Request" },
          { icon: "menu", label: "History" },
        ]}
      />
      <ActionCard
        title="Trip Sheets"
        actions={[
          { icon: "plus", label: "Submit New", href: "/trip-sheets/new" },
          { icon: "menu", label: "Status", href: "/trip-sheets" },
        ]}
      />

      <LinkCard
        title="Payroll"
        summary={
          payrolls.length === 0
            ? "No payrolls available"
            : `${payrolls.length} payroll record(s)`
        }
      />

      <TimeTrackingCard />

      <LinkCard
        title="Schedule"
        summary={
          shifts.length === 0
            ? "No upcoming shifts"
            : `${shifts.length} upcoming shift(s)`
        }
      />

      <HomeMenu />
    </div>
  );
}
