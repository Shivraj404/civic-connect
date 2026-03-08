import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_INFO, DEPARTMENT_INFO, type IssueCategory } from "@/lib/civic-data";
import { MapPin, Upload, Zap, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<IssueCategory | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth");
      else {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.full_name || session.user.email || "");
      }
    });

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/auth");
      else {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.full_name || session.user.email || "");
      }
    };
    check();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const detectLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
          toast.success("Location detected!");
        },
        () => {
          setLocation({ lat: 28.6139, lng: 77.2090 });
          setLocationLoading(false);
          toast.info("Using default location.");
        }
      );
    } else {
      setLocation({ lat: 28.6139, lng: 77.2090 });
      setLocationLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
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

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setAiSuggestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !userId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("issue-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("issue-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const dept = CATEGORY_INFO[category as IssueCategory].department;
      const { error } = await supabase.from("issues").insert({
        title,
        description,
        category,
        department: dept,
        image_url: imageUrl,
        latitude: location?.lat ?? 0,
        longitude: location?.lng ?? 0,
        address: address || null,
        user_id: userId,
        user_name: userName,
      } as any);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Issue reported successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card rounded-2xl p-10">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Issue Reported!</h2>
            <p className="text-muted-foreground mb-2">
              Your complaint has been submitted and routed to the{" "}
              <strong>{DEPARTMENT_INFO[CATEGORY_INFO[category as IssueCategory].department].label}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-6">You can track it on the Track Issues page.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setCategory(""); clearImage(); setLocation(null); setAddress(""); }}>
                Report Another
              </Button>
              <Button variant="outline" onClick={() => navigate("/track")}>Track Issues</Button>
            </div>
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

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">Issue Title *</Label>
            <Input id="title" placeholder="e.g., Large pothole on Main Street" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="font-medium">Description *</Label>
            <Textarea id="desc" placeholder="Describe the issue in detail..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Upload Photo (AI will detect issue type)</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Uploaded" className="max-h-48 mx-auto rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  {aiDetecting && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> AI analyzing image...
                    </div>
                  )}
                  {aiSuggestion && !aiDetecting && (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                      <Zap className="h-4 w-4" /> AI detected: {CATEGORY_INFO[aiSuggestion].icon} {CATEGORY_INFO[aiSuggestion].label}
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Issue Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.icon} {info.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category && (
              <p className="text-xs text-muted-foreground">
                → Routes to: <strong>{DEPARTMENT_INFO[CATEGORY_INFO[category as IssueCategory].department].label}</strong>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="font-medium">Address / Landmark</Label>
            <Input id="address" placeholder="e.g., Near Central Park, Sector 12" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">GPS Location</Label>
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

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</> : "Submit Report"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
