import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Copy, Check } from "lucide-react";
import { SecurePRNG } from "@/lib/prng";

interface Props {
  prng: SecurePRNG | null;
  onGenerate: (num: number) => void;
}

const NumberGenerator = ({ prng, onGenerate }: Props) => {
  const [number, setNumber] = useState<number | null>(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!prng) return;
    setIsGenerating(true);
    // Simulate brief loading
    setTimeout(() => {
      const n = prng.generateInRange(min, max);
      setNumber(n);
      onGenerate(n);
      setIsGenerating(false);
    }, 150);
  };

  const copyToClipboard = () => {
    if (number === null) return;
    navigator.clipboard.writeText(String(number));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-xl mx-auto px-4 mb-12"
    >
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-neon-purple" />
          <h2 className="text-lg font-semibold text-foreground">Random Number Generator</h2>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
            <input type="number" value={min} onChange={e => setMin(Number(e.target.value))}
              className="w-full bg-muted/50 border border-glass-border rounded-xl px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
            <input type="number" value={max} onChange={e => setMax(Number(e.target.value))}
              className="w-full bg-muted/50 border border-glass-border rounded-xl px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50" />
          </div>
        </div>

        <button onClick={generate} disabled={!prng || isGenerating}
          className="w-full gradient-btn rounded-xl py-3 mb-4 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Generate Number
        </button>

        <AnimatePresence mode="wait">
          {number !== null && (
            <motion.div
              key={number}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative p-6 rounded-2xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 neon-glow-blue text-center"
            >
              <p className="text-4xl font-bold font-mono gradient-text">{number}</p>
              <button onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                {copied ? <Check className="w-4 h-4 text-neon-cyan" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default NumberGenerator;
