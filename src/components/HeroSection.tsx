import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";

const HeroSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 text-center py-20 px-4"
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
    >
      <Shield className="w-4 h-4 text-neon-blue" />
      <span className="text-sm text-muted-foreground">SHA-256 Cryptographic Engine</span>
    </motion.div>

    <h1 className="text-5xl md:text-7xl font-bold mb-4">
      <span className="gradient-text">Secure PRNG</span>
      <br />
      <span className="text-foreground">Generator</span>
    </h1>

    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
      SHA-256 Based Cryptographic Pseudo-Random Number Generator
    </p>

    <div className="flex items-center justify-center gap-3">
      <Lock className="w-5 h-5 text-neon-purple" />
      <span className="text-sm text-muted-foreground font-mono">2²⁵⁶ state space · Deterministic · One-way function</span>
    </div>
  </motion.section>
);

export default HeroSection;
