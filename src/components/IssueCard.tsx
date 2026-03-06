import { motion } from "framer-motion";
import { CATEGORY_INFO, STATUS_INFO, type CivicIssue } from "@/lib/civic-data";
import { MapPin, Clock } from "lucide-react";

/* A card displaying a single civic issue report */
const IssueCard = ({ issue, index = 0 }: { issue: CivicIssue; index?: number }) => {
  const catInfo = CATEGORY_INFO[issue.category];
  const statusInfo = STATUS_INFO[issue.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Category + Status row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`${catInfo.badgeClass} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {catInfo.icon} {catInfo.label}
        </span>
        <span className={`${statusInfo.className} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
        {issue.title}
      </h3>

      {/* Description (truncated) */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {issue.description}
      </p>

      {/* Location + time */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {issue.address && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {issue.address}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(issue.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default IssueCard;
