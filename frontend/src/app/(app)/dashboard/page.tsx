import { DashboardIssues } from "@/components/DashboardIssues";
import { getIssues } from "@/services/api";

export default async function DashboardPage() {
  const issues = await getIssues();

  return <DashboardIssues issues={issues} />;
}
