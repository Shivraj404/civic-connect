import { motion } from "framer-motion";
import { MOCK_ISSUES } from "@/lib/civic-data";
import IssueMap from "@/components/IssueMap";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, MapPin } from "lucide-react";

/* Live interactive map page with heatmap toggle */
const MapPage = () => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-7 w-7 text-primary" /> Live Issue Map
            </h1>
            <p className="text-muted-foreground mt-1">
              All reported civic issues displayed on an interactive map
            </p>
          </div>
          <Button
            variant={showHeatmap ? "default" : "outline"}
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="gap-2"
          >
            <Flame className="h-4 w-4" />
            {showHeatmap ? "Hide Heatmap" : "Show AI Heatmap"}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <IssueMap issues={MOCK_ISSUES} className="h-[70vh]" showHeatmap={showHeatmap} />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-4 mt-4 flex flex-wrap gap-4 text-sm"
        >
          <span className="font-semibold text-foreground">Legend:</span>
          {[
            { color: "#E5A023", label: "Pothole / Road" },
            { color: "#34B77C", label: "Garbage" },
            { color: "#7C5DD6", label: "Street Light" },
            { color: "#22A8D8", label: "Water" },
            { color: "#E5566D", label: "Traffic" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;
