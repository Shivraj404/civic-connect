import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_INFO, DEPARTMENT_INFO, type IssueCategory } from "@/lib/civic-data";
import { MapPin, Upload, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/* Report Issue page — form with GPS detection, image upload, and AI classification */
const ReportIssuePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<IssueCategory | null>(null);
  const [submitted, setSubmitted] = useState(false);

  /* Detect GPS location */
  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
          toast.success("Location detected successfully!");
        },
        () => {
          /* Fallback to default location */
          setLocation({ lat: 28.6139, lng: 77.2090 });
          setLocationLoading(false);
          toast.info("Using default location. Enable GPS for accuracy.");
        }
      );
    } else {
      setLocation({ lat: 28.6139, lng: 77.2090 });
      setLocationLoading(false);
    }
  };

  /* Handle image upload + simulate AI classification */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);

      /* Simulate AI detection with a delay */
      setAiDetecting(true);
      setTimeout(() => {
        const categories: IssueCategory[] = ["pothole", "garbage", "streetlight", "water_leakage", "drainage", "traffic_signal"];
        const detected = categories[Math.floor(Math.random() * categories.length)];
        setAiSuggestion(detected);
        setCategory(detected);
        setAiDetecting(false);
        toast.success(`AI detected: ${CATEGORY_INFO[detected].label}`);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  /* Submit form */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    /* Simulate submission */
    setSubmitted(true);
    toast.success("Issue reported successfully!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-10"
          >
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Issue Reported!</h2>
            <p className="text-muted-foreground mb-2">
              Your complaint has been submitted and routed to the{" "}
              <strong>{DEPARTMENT_INFO[CATEGORY_INFO[category as IssueCategory].department].label}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-6">Track ID: #CIV-{Math.floor(Math.random() * 9000 + 1000)}</p>
            <Button variant="hero" onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setCategory(""); setImagePreview(null); setAiSuggestion(null); setLocation(null); }}>
              Report Another Issue
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Report a Civic Issue</h1>
          <p className="text-muted-foreground mb-8">Help improve your city by reporting infrastructure problems.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 md:p-8 space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">Issue Title *</Label>
            <Input id="title" placeholder="e.g., Large pothole on Main Street" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc" className="font-medium">Description *</Label>
            <Textarea id="desc" placeholder="Describe the issue in detail..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Image Upload + AI Detection */}
          <div className="space-y-2">
            <Label className="font-medium">Upload Photo (AI will detect issue type)</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Uploaded" className="max-h-48 mx-auto rounded-lg object-cover" />
                  {aiDetecting && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI analyzing image...
                    </div>
                  )}
                  {aiSuggestion && !aiDetecting && (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                      <Zap className="h-4 w-4" />
                      AI detected: {CATEGORY_INFO[aiSuggestion].icon} {CATEGORY_INFO[aiSuggestion].label}
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="font-medium">Issue Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.icon} {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category && (
              <p className="text-xs text-muted-foreground">
                → Routes to: <strong>{DEPARTMENT_INFO[CATEGORY_INFO[category as IssueCategory].department].label}</strong>
              </p>
            )}
          </div>

          {/* GPS Location */}
          <div className="space-y-2">
            <Label className="font-medium">Location</Label>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={detectLocation} disabled={locationLoading} className="gap-2">
                {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {location ? "Location Detected ✓" : "Detect My Location"}
              </Button>
              {location && (
                <span className="text-xs text-muted-foreground self-center">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            Submit Report
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
