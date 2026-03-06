/* Types and constants for CivicAI */

export type IssueCategory =
  | "pothole"
  | "garbage"
  | "streetlight"
  | "water_leakage"
  | "drainage"
  | "traffic_signal"
  | "damaged_road"
  | "other";

export type IssueStatus = "submitted" | "in_progress" | "resolved";

export type Department =
  | "road"
  | "sanitation"
  | "electricity"
  | "water"
  | "traffic"
  | "general";

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  department: Department;
  image_url?: string;
  latitude: number;
  longitude: number;
  address?: string;
  user_id?: string;
  user_name?: string;
  created_at: string;
  updated_at: string;
}

/* Category display info */
export const CATEGORY_INFO: Record<IssueCategory, { label: string; icon: string; badgeClass: string; department: Department }> = {
  pothole: { label: "Pothole", icon: "🕳️", badgeClass: "badge-pothole", department: "road" },
  garbage: { label: "Garbage Dump", icon: "🗑️", badgeClass: "badge-garbage", department: "sanitation" },
  streetlight: { label: "Street Light", icon: "💡", badgeClass: "badge-streetlight", department: "electricity" },
  water_leakage: { label: "Water Leakage", icon: "💧", badgeClass: "badge-water", department: "water" },
  drainage: { label: "Drainage Issue", icon: "🌊", badgeClass: "badge-drainage", department: "water" },
  traffic_signal: { label: "Traffic Signal", icon: "🚦", badgeClass: "badge-traffic", department: "traffic" },
  damaged_road: { label: "Damaged Road", icon: "🛣️", badgeClass: "badge-pothole", department: "road" },
  other: { label: "Other", icon: "📋", badgeClass: "badge-drainage", department: "general" },
};

export const DEPARTMENT_INFO: Record<Department, { label: string; color: string }> = {
  road: { label: "Road Department", color: "civic-amber" },
  sanitation: { label: "Sanitation Department", color: "civic-emerald" },
  electricity: { label: "Electricity Department", color: "civic-purple" },
  water: { label: "Water Department", color: "civic-cyan" },
  traffic: { label: "Traffic Department", color: "civic-rose" },
  general: { label: "General Services", color: "civic-teal" },
};

export const STATUS_INFO: Record<IssueStatus, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "status-submitted" },
  in_progress: { label: "In Progress", className: "status-in-progress" },
  resolved: { label: "Resolved", className: "status-resolved" },
};

/* Mock data for initial display */
export const MOCK_ISSUES: CivicIssue[] = [
  {
    id: "1", title: "Large pothole on Main Street", description: "A dangerous pothole approximately 2 feet wide near the intersection of Main St and 5th Ave.",
    category: "pothole", status: "submitted", department: "road", latitude: 28.6139, longitude: 77.2090,
    address: "Main Street & 5th Ave", user_name: "Rajesh Kumar", created_at: "2026-03-01T10:00:00Z", updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "2", title: "Garbage overflow at Park Colony", description: "Garbage bins overflowing for 3 days. Strong odor and health hazard.",
    category: "garbage", status: "in_progress", department: "sanitation", latitude: 28.6200, longitude: 77.2150,
    address: "Park Colony, Sector 12", user_name: "Priya Sharma", created_at: "2026-02-28T08:30:00Z", updated_at: "2026-03-02T14:00:00Z",
  },
  {
    id: "3", title: "Broken street light on Ring Road", description: "Street light not working for a week. Very dark and unsafe at night.",
    category: "streetlight", status: "resolved", department: "electricity", latitude: 28.6100, longitude: 77.2000,
    address: "Ring Road, Near Metro Station", user_name: "Amit Patel", created_at: "2026-02-25T16:00:00Z", updated_at: "2026-03-04T09:00:00Z",
  },
  {
    id: "4", title: "Water leakage on MG Road", description: "Major water pipe burst causing flooding on the road.",
    category: "water_leakage", status: "submitted", department: "water", latitude: 28.6180, longitude: 77.2220,
    address: "MG Road, Block B", user_name: "Sneha Gupta", created_at: "2026-03-05T07:15:00Z", updated_at: "2026-03-05T07:15:00Z",
  },
  {
    id: "5", title: "Drainage blocked in Sector 7", description: "Blocked drainage causing water accumulation during rains.",
    category: "drainage", status: "in_progress", department: "water", latitude: 28.6250, longitude: 77.2050,
    address: "Sector 7, Main Market", user_name: "Vikram Singh", created_at: "2026-02-27T11:45:00Z", updated_at: "2026-03-03T16:30:00Z",
  },
  {
    id: "6", title: "Traffic signal malfunction at Crossing", description: "Traffic signal showing green in all directions. Very dangerous.",
    category: "traffic_signal", status: "submitted", department: "traffic", latitude: 28.6160, longitude: 77.2120,
    address: "Central Crossing, NH-44", user_name: "Meera Reddy", created_at: "2026-03-04T18:00:00Z", updated_at: "2026-03-04T18:00:00Z",
  },
  {
    id: "7", title: "Road damaged after construction", description: "Heavy vehicle construction left the road completely damaged.",
    category: "damaged_road", status: "in_progress", department: "road", latitude: 28.6080, longitude: 77.1980,
    address: "Industrial Area, Phase 2", user_name: "Arjun Nair", created_at: "2026-02-20T09:00:00Z", updated_at: "2026-03-01T12:00:00Z",
  },
  {
    id: "8", title: "Pothole cluster near School Zone", description: "Multiple potholes near the school entrance. Risk for children.",
    category: "pothole", status: "submitted", department: "road", latitude: 28.6300, longitude: 77.2180,
    address: "Green Valley School Road", user_name: "Kavita Joshi", created_at: "2026-03-06T06:30:00Z", updated_at: "2026-03-06T06:30:00Z",
  },
];
