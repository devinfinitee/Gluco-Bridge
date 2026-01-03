import { Activity } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Gluco<span className="text-primary">Bridge</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
