import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, ShieldCheck, ArrowRight, Copy, Check } from "lucide-react";
import { SecurePRNG } from "@/lib/prng";

const CryptoDemo = () => {
  const [message, setMessage] = useState("Hello, World!");
  const [copied, setCopied] = useState<string | null>(null);

  const demo = useMemo(() => {
    const prng = new SecurePRNG("crypto_demo_key");
    const key = prng.generateHexKey(32);
    const iv = prng.generateHexKey(16);

    // Simple XOR "encryption" for demo
    const encrypted = Array.from(message).map((ch, i) => {
      const keyByte = parseInt(key.slice((i * 2) % 64, (i * 2) % 64 + 2), 16) || 0;
      return (ch.charCodeAt(0) ^ keyByte).toString(16).padStart(2, '0');
    }).join('');

    const decrypted = Array.from({ length: message.length }, (_, i) => {
      const byte = parseInt(encrypted.slice(i * 2, i * 2 + 2), 16);
      const keyByte = parseInt(key.slice((i * 2) % 64, (i * 2) % 64 + 2), 16) || 0;
      return String.fromCharCode(byte ^ keyByte);
    }).join('');

    return { key, iv, encrypted, decrypted };
  }, [message]);

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const items = [
    { label: "AES-256 Key", value: demo.key, icon: Key, color: "text-neon-blue" },
    { label: "IV (CBC Mode)", value: demo.iv, icon: ShieldCheck, color: "text-neon-cyan" },
    { label: "Encrypted", value: demo.encrypted, icon: Lock, color: "text-neon-purple" },
    { label: "Decrypted", value: demo.decrypted, icon: Unlock, color: "text-neon-blue" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative z-10 max-w-3xl mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        <span className="gradient-text">Crypto Demo</span>
      </h2>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <label className="text-xs text-muted-foreground mb-2 block">Plaintext Message</label>
        <input type="text" value={message} onChange={e => setMessage(e.target.value)}
          className="w-full bg-muted/50 border border-glass-border rounded-xl px-4 py-3 text-foreground font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-neon-blue/50" />
      </div>

      {/* Visual flow */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["Plaintext", "Key + IV", "Encrypt", "Ciphertext", "Decrypt", "Plaintext"].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">{step}</span>
            {i < 5 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-4 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
                <button onClick={() => copyValue(item.label, item.value)}
                  className="ml-auto p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-muted/50 hover:bg-muted">
                  {copied === item.label ? <Check className="w-3 h-3 text-neon-cyan" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                </button>
              </div>
              <p className="font-mono text-xs text-muted-foreground break-all leading-relaxed">
                {item.value}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default CryptoDemo;
