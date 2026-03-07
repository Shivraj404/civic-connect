import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ISSUES, CATEGORY_INFO, STATUS_INFO, DEPARTMENT_INFO, type CivicIssue, type IssueStatus } from "@/lib/civic-data";
import { useIssueFilters, StatCard } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Search, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/* Admin Dashboard — manage complaints, view analytics */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<CivicIssue[]>(MOCK_ISSUES);
  const { filtered, stats, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, search, setSearch } = useIssueFilters(issues);
  const [activeTab, setActiveTab] = useState<"complaints" | "analytics">("complaints");

  /* Check if admin is authenticated */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  /* Update issue status */
  const updateStatus = (id: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus, updated_at: new Date().toISOString() } : issue
      )
    );
    toast.success(`Status updated to ${STATUS_INFO[newStatus].label}`);
  };

  /* Remove spam */
  const removeIssue = (id: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
    toast.success("Report removed");
  };

  /* Chart data */
  const categoryChartData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  const CHART_COLORS = ["#2DB9AA", "#E5A023", "#34B77C", "#7C5DD6", "#22A8D8", "#E5566D"];

  const statusChartData = [
    { name: "Submitted", value: stats.submitted, color: "#E5A023" },
    { name: "In Progress", value: stats.inProgress, color: "#22A8D8" },
    { name: "Resolved", value: stats.resolved, color: "#34B77C" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">Admin Dashboard</h1>
              <p className="text-muted-foreground mb-6">Manage complaints and view analytics</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Complaints" value={stats.total} icon={<BarChart3 className="h-5 w-5" />} />
          <StatCard label="Pending" value={stats.submitted} icon={<AlertTriangle className="h-5 w-5" />} color="civic-amber" />
          <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5" />} color="civic-cyan" />
          <StatCard label="Resolution Rate" value={`${stats.resolutionRate}%`} icon={<CheckCircle2 className="h-5 w-5" />} color="civic-emerald" />
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "complaints" as const, label: "Complaints", icon: <AlertTriangle className="h-4 w-4" /> },
            { id: "analytics" as const, label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>

        {/* ===== COMPLAINTS TAB ===== */}
        {activeTab === "complaints" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filters */}
            <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_INFO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_INFO).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Complaints table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Issue</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground hidden lg:table-cell">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((issue) => (
                      <tr key={issue.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{issue.title}</p>
                          <p className="text-xs text-muted-foreground">{issue.user_name} • {issue.address}</p>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className={`${CATEGORY_INFO[issue.category].badgeClass} text-xs px-2 py-1 rounded-full`}>
                            {CATEGORY_INFO[issue.category].icon} {CATEGORY_INFO[issue.category].label}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-xs text-muted-foreground">
                          {DEPARTMENT_INFO[issue.department].label}
                        </td>
                        <td className="py-3 px-4">
                          <Select value={issue.status} onValueChange={(v) => updateStatus(issue.id, v as IssueStatus)}>
                            <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_INFO).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="icon" onClick={() => removeIssue(issue.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No complaints found.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
            {/* Bar chart - by category */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Complaints by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart - by status */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution rate */}
            <div className="glass-card rounded-xl p-6 lg:col-span-2">
              <h3 className="font-display font-semibold text-foreground mb-4">Department Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(DEPARTMENT_INFO).map(([key, dept]) => {
                  const deptIssues = issues.filter((i) => i.department === key);
                  const resolved = deptIssues.filter((i) => i.status === "resolved").length;
                  const rate = deptIssues.length ? Math.round((resolved / deptIssues.length) * 100) : 0;
                  return (
                    <div key={key} className="bg-muted/50 rounded-lg p-4">
                      <p className="font-medium text-sm text-foreground">{dept.label}</p>
                      <p className="text-2xl font-display font-bold text-primary mt-1">{rate}%</p>
                      <p className="text-xs text-muted-foreground">{deptIssues.length} complaints</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
