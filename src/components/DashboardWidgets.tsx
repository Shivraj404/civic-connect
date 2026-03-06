import { CATEGORY_INFO, MOCK_ISSUES, type CivicIssue, type IssueCategory, type IssueStatus } from "@/lib/civic-data";
import { useState, useMemo } from "react";

/* Stat card component for dashboards */
export const StatCard = ({
  label,
  value,
  icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) => (
  <div className="glass-card rounded-xl p-5 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-lg bg-${color}/10 flex items-center justify-center text-${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

/* Hook to manage and filter issues */
export const useIssueFilters = (issues: CivicIssue[] = MOCK_ISSUES) => {
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      if (categoryFilter !== "all" && issue.category !== categoryFilter) return false;
      if (statusFilter !== "all" && issue.status !== statusFilter) return false;
      if (search && !issue.title.toLowerCase().includes(search.toLowerCase()) && !issue.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [issues, categoryFilter, statusFilter, search]);

  /* Analytics calculations */
  const stats = useMemo(() => {
    const total = issues.length;
    const submitted = issues.filter((i) => i.status === "submitted").length;
    const inProgress = issues.filter((i) => i.status === "in_progress").length;
    const resolved = issues.filter((i) => i.status === "resolved").length;
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

    const byCategory: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    issues.forEach((i) => {
      const catLabel = CATEGORY_INFO[i.category].label;
      byCategory[catLabel] = (byCategory[catLabel] || 0) + 1;
      byDepartment[i.department] = (byDepartment[i.department] || 0) + 1;
    });

    return { total, submitted, inProgress, resolved, resolutionRate, byCategory, byDepartment };
  }, [issues]);

  return {
    filtered,
    stats,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
  };
};
