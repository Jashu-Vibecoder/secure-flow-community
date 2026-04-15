import { Github, Shield } from "lucide-react";

const Footer = () => (
  <footer className="relative z-10 border-t border-glass-border py-8 mt-12">
    <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-neon-blue" />
        <p className="text-sm text-muted-foreground">
          Built using SHA-256 hashing for secure pseudo-random number generation
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href="#" className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <Github className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
