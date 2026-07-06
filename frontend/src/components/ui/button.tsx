import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    secondary: "bg-white/10 text-white hover:bg-white/15",
    ghost: "bg-transparent text-slate-200 hover:bg-white/10",
    danger: "bg-rose-400 text-slate-950 hover:bg-rose-300",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
