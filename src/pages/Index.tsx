import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { HeroOrbs, CityGrid } from "@/components/HeroBackground";
import IssueCard from "@/components/IssueCard";
import { CATEGORY_INFO, type CivicIssue } from "@/lib/civic-data";
import {
  MapPin, Shield, BarChart3, Zap, ArrowRight, CheckCircle2,
  Clock, Upload, Search, Building2, Users, TrendingUp,
  FileCheck, Send, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* Animated counter */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration: 2, ease: "easeOut" });
      const unsub = rounded.on("change", (v) => {
        if (ref.current) ref.current.textContent = v.toLocaleString() + suffix;
      });
      return unsub;
    }
  }, [inView, target, suffix, count, rounded]);

  return <span ref={ref}>0{suffix}</span>;
};

const fetchRecentIssues = async (): Promise<CivicIssue[]> => {
  const { data, error } = await supabase.from("issues").select("*").order("created_at", { ascending: false }).limit(6);
  if (error) throw error;
  return (data as any[]) || [];
};

const Index = () => {
  const { data: recentIssues = [] } = useQuery({ queryKey: ["recent-issues"], queryFn: fetchRecentIssues });

  const features = [
    { icon: <Upload className="h-6 w-6" />, title: "Smart Upload", desc: "Upload a photo and our AI instantly detects the issue type — pothole, garbage, broken light, and more." },
    { icon: <MapPin className="h-6 w-6" />, title: "GPS Pinning", desc: "Automatic location detection pins your report to the exact coordinates for precise mapping." },
    { icon: <Zap className="h-6 w-6" />, title: "AI Classification", desc: "Machine learning categorizes and routes complaints to the correct department in real-time." },
    { icon: <Shield className="h-6 w-6" />, title: "Smart Routing", desc: "Each issue is intelligently assigned to the responsible government department." },
    { icon: <BarChart3 className="h-6 w-6" />, title: "Live Analytics", desc: "Track resolution rates, department performance, and civic health metrics on dashboards." },
    { icon: <Search className="h-6 w-6" />, title: "Real-Time Tracking", desc: "Monitor the status of your reports from submission to resolution." },
  ];

  const steps = [
    { icon: <Send className="h-8 w-8" />, step: "01", title: "Report Issue", desc: "Upload a photo, describe the problem, and let AI detect the category automatically." },
    { icon: <Eye className="h-8 w-8" />, step: "02", title: "Authority Review", desc: "The right department receives your report and begins assessment immediately." },
    { icon: <FileCheck className="h-8 w-8" />, step: "03", title: "Issue Resolved", desc: "Track progress in real-time and get notified when the issue is fixed." },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative hero-gradient min-h-[92vh] flex items-center overflow-hidden">
        <CityGrid />
        <HeroOrbs />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 glass-card px-5 py-2 rounded-full text-sm font-medium text-primary-foreground/80 mb-6">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                AI-Powered Civic Issue Reporting
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6"
            >
              Report. Track.{" "}
              <span className="gradient-text">Resolve.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-primary-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              CivicAI uses artificial intelligence to detect, classify, and route civic infrastructure issues to the right department — instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/report">
                <Button variant="hero" size="lg" className="gap-2 glow-primary text-base px-8 py-6">
                  Report an Issue <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="hero-outline" size="lg" className="gap-2 text-base px-8 py-6">
                  <BarChart3 className="h-5 w-5" /> Track Issues
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative -mt-12 z-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="glass-card-strong rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <MapPin className="h-5 w-5" />, value: 1247, label: "Issues Reported" },
              { icon: <CheckCircle2 className="h-5 w-5" />, value: 89, suffix: "%", label: "Resolution Rate" },
              { icon: <Building2 className="h-5 w-5" />, value: 6, label: "Departments" },
              { icon: <Users className="h-5 w-5" />, value: 3420, label: "Active Citizens" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  {stat.icon}
                  <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-display font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">Three simple steps to make your city better</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20" />
                )}
                <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-display font-semibold text-sm uppercase tracking-wider">Platform Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">Built for Smart Cities</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">Powerful AI-driven tools to streamline civic issue management</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-7 hover:shadow-xl transition-all duration-300 group cursor-default"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-primary font-display font-semibold text-sm uppercase tracking-wider">Issue Categories</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">What Can You Report?</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {Object.entries(CATEGORY_INFO).map(([key, info], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
              >
                <span className="text-4xl block mb-3">{info.icon}</span>
                <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{info.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT REPORTS ===== */}
      {recentIssues.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-primary font-display font-semibold text-sm uppercase tracking-wider">Live Feed</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Recent Reports</h2>
                <p className="text-muted-foreground mt-1">Latest civic issues reported by citizens</p>
              </div>
              <Link to="/track">
                <Button variant="outline" className="gap-2 hidden sm:flex">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIssues.slice(0, 6).map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/track">
                <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <HeroOrbs />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Make Your City Better
            </h2>
            <p className="text-primary-foreground/60 mb-10 max-w-md mx-auto text-lg">
              Every report matters. Join thousands of citizens making their neighborhoods safer and cleaner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button variant="hero" size="lg" className="gap-2 glow-primary text-base px-8 py-6">
                  Start Reporting <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="hero-outline" size="lg" className="gap-2 text-base px-8 py-6">
                  <MapPin className="h-5 w-5" /> View Heatmap
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Civic<span className="gradient-text">AI</span>
              </span>
            </div>
            <div className="flex gap-6">
              <Link to="/report" className="text-sm text-muted-foreground hover:text-primary transition-colors">Report</Link>
              <Link to="/track" className="text-sm text-muted-foreground hover:text-primary transition-colors">Track</Link>
              <Link to="/map" className="text-sm text-muted-foreground hover:text-primary transition-colors">Map</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 CivicAI. Building smarter cities with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
