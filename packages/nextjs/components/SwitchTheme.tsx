"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  });

  return (
    <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
      <></>
    </div>
  );
};
