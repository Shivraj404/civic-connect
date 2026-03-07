import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroOrbs, CityGrid } from "@/components/HeroBackground";
import IssueCard from "@/components/IssueCard";
import { MOCK_ISSUES, CATEGORY_INFO } from "@/lib/civic-data";
import { MapPin, Shield, BarChart3, Zap, ArrowRight, Users, CheckCircle2, Clock } from "lucide-react";

/* Landing page — hero + features + recent issues */
const Index = () => {
  const recentIssues = MOCK_ISSUES.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative hero-gradient min-h-[90vh] flex items-center overflow-hidden">
        <CityGrid />
        <HeroOrbs />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block glass-card px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground/80 mb-6">
                🏙️ AI-Powered Civic Issue Reporting
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Report. Track.{" "}
              <span className="gradient-text">Resolve.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-xl mx-auto"
            >
              CivicAI uses artificial intelligence to detect, classify, and route
              civic infrastructure issues to the right department — instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/report">
                <Button variant="hero" size="lg" className="gap-2 glow-primary">
                  Report an Issue <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="hero-outline" size="lg" className="gap-2">
                  <BarChart3 className="h-4 w-4" /> Track Issues
                </Button>
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center gap-8 mt-12"
            >
              {[
                { value: "1,247", label: "Issues Reported", icon: <MapPin className="h-4 w-4" /> },
                { value: "89%", label: "Resolution Rate", icon: <CheckCircle2 className="h-4 w-4" /> },
                { value: "24h", label: "Avg. Response", icon: <Clock className="h-4 w-4" /> },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary-foreground/90 mb-1">
                    {stat.icon}
                    <span className="font-display text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-xs text-primary-foreground/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How CivicAI Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Smart technology for smarter cities. Report issues in seconds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "GPS Detection",
                desc: "Automatic location detection pins your report to the exact spot.",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "AI Classification",
                desc: "Upload a photo and AI detects the issue type automatically.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Smart Routing",
                desc: "Complaints are routed to the correct department instantly.",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Analytics & Heatmap",
                desc: "Identify problem hotspots with AI-powered complaint heatmaps.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ISSUE CATEGORIES ===== */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
            What Can You Report?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(CATEGORY_INFO).map(([key, info], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5 text-center hover:shadow-md transition-all cursor-pointer group"
              >
                <span className="text-3xl block mb-2">{info.icon}</span>
                <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {info.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT REPORTS ===== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Recent Reports</h2>
              <p className="text-muted-foreground mt-1">Latest civic issues reported by citizens</p>
            </div>
            <Link to="/track">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <HeroOrbs />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Make Your City Better
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
              Every report matters. Join thousands of citizens making their neighborhoods safer and cleaner.
            </p>
            <Link to="/report">
              <Button variant="hero" size="lg" className="gap-2 glow-primary">
                Start Reporting <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              Civic<span className="gradient-text">AI</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 CivicAI. Building smarter cities with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
