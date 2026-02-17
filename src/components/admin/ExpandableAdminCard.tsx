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

              {/* Actions inside expanded area */}
              {actions && (
                <div
                  className="flex items-center justify-end gap-1 px-3 pb-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
