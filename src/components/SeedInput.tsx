import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Play, RotateCcw } from "lucide-react";
import { SecurePRNG } from "@/lib/prng";

interface SeedInputProps {
  onInit: (prng: SecurePRNG, seed: string) => void;
}

const SeedInput = ({ onInit }: SeedInputProps) => {
  const [seed, setSeed] = useState("my_secure_seed");
  const [initialized, setInitialized] = useState(false);

  const handleInit = () => {
    if (!seed.trim()) return;
    const prng = new SecurePRNG(seed.trim());
    onInit(prng, seed.trim());
    setInitialized(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-xl mx-auto px-4 mb-12"
    >
      <div className="glass-card rounded-2xl p-6 neon-glow-blue">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-semibold text-foreground">Seed Input</h2>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={seed}
            onChange={(e) => { setSeed(e.target.value); setInitialized(false); }}
            placeholder="Enter seed string..."
            className="flex-1 bg-muted/50 border border-glass-border rounded-xl px-4 py-3 text-foreground font-mono text-sm
              focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all placeholder:text-muted-foreground"
          />
          <button onClick={handleInit} className="gradient-btn rounded-xl px-6 py-3 flex items-center gap-2">
            {initialized ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {initialized ? "Reset" : "Initialize"}
          </button>
        </div>

        {initialized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-muted/30 rounded-xl font-mono text-xs text-muted-foreground"
          >
            <span className="text-neon-cyan">State:</span> {seed.slice(0, 8)}••••••••
            <span className="ml-4 text-neon-blue">Status:</span> Ready
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default SeedInput;
