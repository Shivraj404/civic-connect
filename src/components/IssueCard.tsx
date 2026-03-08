import { motion } from "framer-motion";
import { CATEGORY_INFO, STATUS_INFO, type CivicIssue } from "@/lib/civic-data";
import { MapPin, Clock, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const IssueCard = ({ issue, index = 0 }: { issue: CivicIssue; index?: number }) => {
  const catInfo = CATEGORY_INFO[issue.category];
  const statusInfo = STATUS_INFO[issue.status];
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
      >
        {/* Image */}
        {issue.image_url ? (
          <div
            className="relative h-44 bg-muted cursor-pointer overflow-hidden"
            onClick={() => setLightbox(true)}
          >
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="h-28 bg-muted/50 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        <div className="p-5">
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
          <h3 className="font-display font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
            {issue.title}
          </h3>

          {/* Description (truncated) */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {issue.description}
          </p>

          {/* Location + time */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {issue.address && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 flex-shrink-0" /> {issue.address}
              </span>
            )}
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock className="h-3 w-3" />
              {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      {issue.image_url && (
        <Dialog open={lightbox} onOpenChange={setLightbox}>
          <DialogContent className="max-w-3xl p-2 bg-background/95 backdrop-blur-xl">
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default IssueCard;
