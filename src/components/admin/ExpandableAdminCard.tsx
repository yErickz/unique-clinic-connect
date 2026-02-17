import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpandableAdminCardProps {
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ExpandableAdminCard({ children, expandedContent, actions, className = "" }: ExpandableAdminCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`bg-card rounded-xl border border-border group hover:border-accent/30 hover:shadow-md transition-all relative overflow-hidden cursor-pointer ${className}`}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      {/* Actions overlay */}
      {actions && (
        <div
          className="absolute top-2 right-2 z-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}

      {/* Main content (always visible) */}
      <div className="relative">
        {children}
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          <ChevronDown size={14} className="text-muted-foreground/50" />
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="border-t border-border">
              {expandedContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
