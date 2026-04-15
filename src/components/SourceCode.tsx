import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";

const PYTHON_CODE = `import hashlib  # Library used for SHA-256 hashing

class SecurePRNG:
    """
    SecurePRNG implements a pseudo-random number generator
    using SHA-256 hashing.
    The generator uses an internal state (seed) which is
    continuously updated using hashing to produce a stream
    of random-like numbers.
    """

    def __init__(self, seed):
        """
        Constructor to initialize the PRNG.
        Parameters:
        seed (str): Initial input used to start the random generation.
        """
        # Convert seed string to bytes and store as internal state
        self.state = seed.encode()

    def generate(self):
        """
        Generates a large pseudo-random integer using SHA-256.
        Process:
        1. Hash current state
        2. Convert hash to integer
        3. Update state with new hash
        Returns:
        int: A large pseudo-random number
        """
        # Apply SHA-256 hashing on current state
        hash_output = hashlib.sha256(self.state).hexdigest()

        # Convert hexadecimal hash to integer
        number = int(hash_output, 16)

        # Update internal state for next iteration
        # This ensures new random output each time
        self.state = hash_output.encode()

        return number

    def generate_in_range(self, low, high):
        """
        Generates a pseudo-random number within a given range.
        Parameters:
        low (int): Lower bound
        high (int): Upper bound
        Returns:
        int: Random number between low and high (inclusive)
        """
        # Generate a large random number
        num = self.generate()

        # Use modulo operation to limit the number within range
        return low + (num % (high - low + 1))

# ------------------ TESTING SECTION ------------------
"""
This section demonstrates the working of the PRNG.
It initializes the generator and prints 10 random numbers.
"""

# Initialize PRNG with a seed value
prng = SecurePRNG("my_secure_seed")

print("Random Numbers:")

# Generate and print 10 random numbers between 0 and 10
for i in range(10):
    print(prng.generate_in_range(0, 10))`;

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

        <div className="overflow-auto max-h-[500px] rounded-xl bg-background/50 border border-glass-border p-4">
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
