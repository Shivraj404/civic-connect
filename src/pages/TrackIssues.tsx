import { motion } from "framer-motion";
import { MOCK_ISSUES, CATEGORY_INFO, type IssueCategory, type IssueStatus } from "@/lib/civic-data";
import IssueCard from "@/components/IssueCard";
import { useIssueFilters } from "@/components/DashboardWidgets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

/* Track Issues page — searchable, filterable list of reported issues */
const TrackIssuesPage = () => {
  const { filtered, stats, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, search, setSearch } = useIssueFilters(MOCK_ISSUES);

  const categories: (IssueCategory | "all")[] = ["all", "pothole", "garbage", "streetlight", "water_leakage", "drainage", "traffic_signal", "damaged_road"];
  const statuses: (IssueStatus | "all")[] = ["all", "submitted", "in_progress", "resolved"];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Track Issues</h1>
          <p className="text-muted-foreground mb-6">Monitor the status of all civic complaints</p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, cls: "text-foreground" },
            { label: "Submitted", value: stats.submitted, cls: "text-civic-amber" },
            { label: "In Progress", value: stats.inProgress, cls: "text-civic-cyan" },
            { label: "Resolved", value: stats.resolved, cls: "text-civic-emerald" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <p className={`text-2xl font-display font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="glass-card rounded-xl p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search issues..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  className="text-xs"
                >
                  {cat === "all" ? "All" : `${CATEGORY_INFO[cat].icon} ${CATEGORY_INFO[cat].label}`}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Status:</span>
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="text-xs"
                >
                  {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Issue list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No issues found matching your filters.</div>
        )}
      </div>
    </div>
  );
};

export default TrackIssuesPage;
