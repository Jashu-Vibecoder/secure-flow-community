import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";

const PYTHON_CODE = `import hashlib

class SecurePRNG:

    def __init__(self, seed):
        self.state = seed.encode()

    def generate(self):
        hash_output = hashlib.sha256(self.state).hexdigest()
        number = int(hash_output, 16)
        self.state = hash_output.encode()
        return number

    def generate_in_range(self, low, high):
        num = self.generate()
        return low + (num % (high - low + 1))

# ------------------ USER INPUT ------------------

seed = input("Enter seed value: ")
low = int(input("Enter lower limit: "))
high = int(input("Enter upper limit: "))
count = int(input("How many random numbers to generate? "))

# Validation
if low > high:
    print("Invalid range! Lower limit must be <= upper limit.")
else:
    prng = SecurePRNG(seed)
    print("\\nRandom Numbers:")
    for i in range(count):
        print(prng.generate_in_range(low, high))`;

const SourceCode = () => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-3xl mx-auto px-4 mb-12"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        <span className="gradient-text">Python Source Code</span>
      </h2>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-neon-cyan" />
            <span className="text-sm font-semibold text-foreground">prng.py</span>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">Python</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs text-muted-foreground"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-neon-cyan" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="rounded-xl bg-background/50 border border-glass-border p-4">
          <pre className="text-xs font-mono leading-relaxed text-muted-foreground whitespace-pre">
            {PYTHON_CODE.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 shrink-0 text-right pr-3 select-none opacity-40">{i + 1}</span>
                <span className={
                  line.trimStart().startsWith("#") ? "text-neon-blue/60" :
                  line.trimStart().startsWith('"""') || line.trimStart().startsWith("'''") ? "text-neon-cyan/50" :
                  line.includes("def ") ? "text-neon-purple" :
                  line.includes("class ") ? "text-neon-blue" :
                  ""
                }>{line || " "}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </motion.section>
  );
};

export default SourceCode;
