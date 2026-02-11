import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Easing function for smooth animation
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

export default function ScoreCounter({
  end,
  duration = 1500,
  className = "",
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration]);

  // Counter animation variants
  const counterVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={counterVariants}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      className={className}
    >
      {count}
    </motion.div>
  );
}
