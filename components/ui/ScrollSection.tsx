"use client";

import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollSection({ children, className = "", delay = 0 }: Props) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`scroll-hidden ${isVisible ? "scroll-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
