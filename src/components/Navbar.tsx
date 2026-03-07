import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/report", label: "Report Issue" },
    { to: "/track", label: "Track Issues" },
    { to: "/admin/login", label: "Admin" },
  ];

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">Civic<span className="gradient-text">AI</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant={location.pathname === link.to ? "default" : "ghost"} size="sm" className="font-medium">{link.label}</Button>
            </Link>
          ))}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 ml-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-1 ml-2"><User className="h-4 w-4" /> Sign In</Button>
            </Link>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden glass-card-strong border-t border-border/30 px-4 pb-4">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-2">
              <Button variant={location.pathname === link.to ? "default" : "ghost"} className="w-full justify-start">{link.label}</Button>
            </Link>
          ))}
          {user ? (
            <Button variant="ghost" className="w-full justify-start gap-2 mt-1" onClick={() => { handleLogout(); setMobileOpen(false); }}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2">
              <Button variant="outline" className="w-full justify-start gap-2"><User className="h-4 w-4" /> Sign In</Button>
            </Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
