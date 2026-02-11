import { motion } from "framer-motion";

// Floating shape component
function FloatingShape({
  size,
  x,
  y,
  duration,
  delay,
  color,
  opacity = 0.1,
  blur = 60,
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-2xl"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        backgroundColor: color,
        opacity,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function DynamicBackground({
  intensity = "calm", // calm | medium | energetic
  children,
}) {
  // Shape configurations based on intensity
  const shapes = {
    calm: [
      { size: 300, x: "-10%", y: "10%", duration: 8, delay: 0, color: "#6366f1" },
      { size: 200, x: "80%", y: "60%", duration: 10, delay: 1, color: "#8b5cf6" },
      { size: 150, x: "50%", y: "80%", duration: 12, delay: 2, color: "#a855f7" },
    ],
    medium: [
      { size: 350, x: "-5%", y: "5%", duration: 6, delay: 0, color: "#6366f1" },
      { size: 250, x: "75%", y: "50%", duration: 8, delay: 0.5, color: "#8b5cf6" },
      { size: 200, x: "40%", y: "70%", duration: 10, delay: 1, color: "#a855f7" },
      { size: 150, x: "20%", y: "40%", duration: 7, delay: 1.5, color: "#29AB00" },
    ],
    energetic: [
      { size: 400, x: "-10%", y: "0%", duration: 5, delay: 0, color: "#6366f1" },
      { size: 300, x: "70%", y: "40%", duration: 6, delay: 0.3, color: "#8b5cf6" },
      { size: 250, x: "30%", y: "60%", duration: 7, delay: 0.6, color: "#a855f7" },
      { size: 200, x: "10%", y: "30%", duration: 5.5, delay: 0.9, color: "#29AB00" },
      { size: 180, x: "60%", y: "80%", duration: 6.5, delay: 1.2, color: "#f59e0b" },
      { size: 150, x: "85%", y: "10%", duration: 5.8, delay: 1.5, color: "#ec4899" },
    ],
  };

  const currentShapes = shapes[intensity] || shapes.calm;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{
          background: `linear-gradient(135deg,
            ${intensity === "energetic" ? "#1e1b4b" : intensity === "medium" ? "#f8fafc" : "#f8fafc"}
            0%,
            ${intensity === "energetic" ? "#312e81" : intensity === "medium" ? "#ede9fe" : "#f1f5f9"}
            50%,
            ${intensity === "energetic" ? "#1e1b4b" : intensity === "medium" ? "#f8fafc" : "#f8fafc"}
            100%)`,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Dark mode gradient */}
      <motion.div
        className="absolute inset-0 -z-20 dark:block hidden"
        style={{
          background: `linear-gradient(135deg,
            #09090b 0%,
            #18181b 50%,
            #09090b 100%)`,
        }}
      />

      {/* Floating shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {currentShapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} />
        ))}
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      {children}
    </div>
  );
}
