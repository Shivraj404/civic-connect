import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/* Animated floating orbs for the hero background */
const HeroOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large teal orb */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/20 blur-3xl"
      />
      {/* Cyan orb */}
      <motion.div
        animate={{ y: [15, -25, 15], x: [10, -15, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-accent/15 blur-3xl"
      />
      {/* Small emerald orb */}
      <motion.div
        animate={{ y: [-15, 20, -15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-[30%] w-48 h-48 rounded-full bg-civic-emerald/15 blur-3xl"
      />
    </div>
  );
};

/* 3D-style floating city grid using CSS (lightweight alternative to Three.js for performance) */
const CityGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    let frame = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      /* Draw perspective grid lines */
      const vanishX = w / 2;
      const vanishY = h * 0.35;
      const gridLines = 12;

      ctx.strokeStyle = "rgba(45, 185, 170, 0.08)";
      ctx.lineWidth = 1;

      /* Horizontal lines */
      for (let i = 0; i < gridLines; i++) {
        const y = vanishY + (h - vanishY) * (i / gridLines);
        const spread = ((y - vanishY) / (h - vanishY)) * w * 0.8;
        ctx.beginPath();
        ctx.moveTo(vanishX - spread, y);
        ctx.lineTo(vanishX + spread, y);
        ctx.stroke();
      }

      /* Vertical converging lines */
      for (let i = -6; i <= 6; i++) {
        const bottomX = vanishX + i * (w / 8);
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, h);
        ctx.stroke();
      }

      /* Animated dots at intersections */
      const time = frame * 0.02;
      for (let i = 0; i < 20; i++) {
        const t = ((i * 0.15 + time) % 1);
        const y = vanishY + (h - vanishY) * t;
        const spread = t * w * 0.5;
        const x = vanishX + Math.sin(i * 1.5) * spread;
        const alpha = Math.sin(t * Math.PI) * 0.6;
        const size = 1 + t * 2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 185, 170, ${alpha})`;
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
    />
  );
};

export { HeroOrbs, CityGrid };
