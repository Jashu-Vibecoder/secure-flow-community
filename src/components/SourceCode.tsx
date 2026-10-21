import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Code, Copy } from "lucide-react";

const SOURCES = {
  python: {
    label: "Python",
    filename: "prng.py",
    code: `import hashlib


class SecurePRNG:
    """A deterministic SHA-256 hash-chain generator."""

    def __init__(self, seed: str):
        if not seed:
            raise ValueError("Seed must not be empty")
        self.seed = seed
        self.state = seed.encode("utf-8")

    def generate(self) -> int:
        digest = hashlib.sha256(self.state).hexdigest()
        self.state = digest.encode("ascii")
        return int(digest, 16)

    def generate_in_range(self, low: int, high: int) -> int:
        if low > high:
            raise ValueError("low must be less than or equal to high")
        return low + self.generate() % (high - low + 1)

    def reset(self):
        self.state = self.seed.encode("utf-8")


if __name__ == "__main__":
    seed = input("Enter seed: ")
    low = int(input("Enter lower limit: "))
    high = int(input("Enter upper limit: "))
    count = int(input("How many numbers? "))

    generator = SecurePRNG(seed)
    for _ in range(count):
        print(generator.generate_in_range(low, high))`,
  },
  javascript: {
    label: "JavaScript",
    filename: "prng.js",
    code: `import { createHash } from "node:crypto";

class SecurePRNG {
  constructor(seed) {
    if (!seed) throw new Error("Seed must not be empty");
    this.seed = seed;
    this.state = seed;
  }

  generate() {
    const digest = createHash("sha256").update(this.state, "utf8").digest("hex");
    this.state = digest;
    return BigInt("0x" + digest);
  }

  generateInRange(low, high) {
    if (low > high) throw new Error("low must be <= high");
    const range = BigInt(high - low + 1);
    return low + Number(this.generate() % range);
  }

  reset() {
    this.state = this.seed;
  }
}

const seed = process.argv[2] ?? "hello";
const generator = new SecurePRNG(seed);
for (let i = 0; i < 10; i++) {
  console.log(generator.generateInRange(1, 100));
}`,
  },
  typescript: {
    label: "TypeScript",
    filename: "prng.ts",
    code: `import { createHash } from "node:crypto";

class SecurePRNG {
  private state: string;
  private readonly seed: string;

  constructor(seed: string) {
    if (!seed) throw new Error("Seed must not be empty");
    this.seed = seed;
    this.state = seed;
  }

  generate(): bigint {
    const digest = createHash("sha256").update(this.state, "utf8").digest("hex");
    this.state = digest;
    return BigInt("0x" + digest);
  }

  generateInRange(low: number, high: number): number {
    if (!Number.isInteger(low) || !Number.isInteger(high) || low > high) {
      throw new Error("Expected integer bounds with low <= high");
    }
    const range = BigInt(high - low + 1);
    return low + Number(this.generate() % range);
  }

  reset(): void {
    this.state = this.seed;
  }
}

const generator = new SecurePRNG(process.argv[2] ?? "hello");
for (let i = 0; i < 10; i++) {
  console.log(generator.generateInRange(1, 100));
}`,
  },
  kotlin: {
    label: "Kotlin",
    filename: "Main.kt",
    code: `import java.security.MessageDigest

class SecurePRNG(seed: String) {
    private val originalSeed = seed.also {
        require(it.isNotEmpty()) { "Seed must not be empty" }
    }
    private var state = originalSeed

    fun generate(): java.math.BigInteger {
        val digest = MessageDigest.getInstance("SHA-256")
            .digest(state.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }
        state = digest
        return java.math.BigInteger(digest, 16)
    }

    fun generateInRange(low: Int, high: Int): Int {
        require(low <= high) { "low must be <= high" }
        val range = java.math.BigInteger.valueOf((high - low + 1).toLong())
        return low + generate().mod(range).toInt()
    }

    fun reset() { state = originalSeed }
}

fun main() {
    val generator = SecurePRNG(args.firstOrNull() ?: "hello")
    repeat(10) { println(generator.generateInRange(1, 100)) }
}`,
  },
  java: {
    label: "Java",
    filename: "Main.java",
    code: `import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

class SecurePRNG {
    private final String seed;
    private String state;

    SecurePRNG(String seed) {
        if (seed == null || seed.isEmpty()) {
            throw new IllegalArgumentException("Seed must not be empty");
        }
        this.seed = seed;
        this.state = seed;
    }

    BigInteger generate() {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256")
                .digest(state.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte value : bytes) hex.append(String.format("%02x", value));
            state = hex.toString();
            return new BigInteger(state, 16);
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException("SHA-256 is unavailable", error);
        }
    }

    int generateInRange(int low, int high) {
        if (low > high) throw new IllegalArgumentException("low must be <= high");
        BigInteger range = BigInteger.valueOf((long) high - low + 1);
        return low + generate().mod(range).intValue();
    }

    void reset() { state = seed; }
}

public class Main {
    public static void main(String[] args) {
        SecurePRNG generator = new SecurePRNG(args.length > 0 ? args[0] : "hello");
        for (int i = 0; i < 10; i++) {
            System.out.println(generator.generateInRange(1, 100));
        }
    }
}`,
  },
  html: {
    label: "HTML/CSS",
    filename: "index.html",
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SHA-256 PRNG Demo</title>
    <style>
      body { font: 16px system-ui; max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
      label { display: block; margin: 1rem 0; }
      input, button { font: inherit; padding: 0.5rem; }
      #output { overflow-wrap: anywhere; }
    </style>
  </head>
  <body>
    <h1>SHA-256 PRNG</h1>
    <label>Seed <input id="seed" value="hello" /></label>
    <label>Count <input id="count" type="number" min="1" value="5" /></label>
    <label>Lower limit <input id="low" type="number" value="1" /></label>
    <label>Upper limit <input id="high" type="number" value="100" /></label>
    <button id="generate">Generate</button>
    <ol id="output"></ol>
    <script>
      const encoder = new TextEncoder();
      const toHex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

      async function generate(seed, count, low, high) {
        if (!seed || low > high) throw new Error("Enter a seed and a valid range");
        let state = seed;
        const values = [];
        for (let i = 0; i < count; i++) {
          const digest = await crypto.subtle.digest("SHA-256", encoder.encode(state));
          const hex = toHex(new Uint8Array(digest));
          state = hex;
          const range = BigInt(high - low + 1);
          values.push(low + Number(BigInt("0x" + hex) % range));
        }
        return values;
      }

      document.querySelector("#generate").addEventListener("click", async () => {
        const seed = document.querySelector("#seed").value;
        const count = Number(document.querySelector("#count").value);
        const low = Number(document.querySelector("#low").value);
        const high = Number(document.querySelector("#high").value);
        const output = document.querySelector("#output");
        output.replaceChildren();
        try {
          for (const value of await generate(seed, count, low, high)) {
            const item = document.createElement("li");
            item.textContent = value;
            output.append(item);
          }
        } catch (error) {
          output.textContent = error.message;
        }
      });
    </script>
  </body>
</html>`,
  },
  dart: {
    label: "Dart",
    filename: "main.dart",
    code: `// Add crypto to pubspec.yaml: dependencies: { crypto: ^3.0.0 }
import 'dart:convert';
import 'package:crypto/crypto.dart';

class SecurePRNG {
  SecurePRNG(String seed) : _seed = seed, _state = seed {
    if (seed.isEmpty) throw ArgumentError('Seed must not be empty');
  }

  final String _seed;
  String _state;

  BigInt generate() {
    final digest = sha256.convert(utf8.encode(_state)).toString();
    _state = digest;
    return BigInt.parse(digest, radix: 16);
  }

  int generateInRange(int low, int high) {
    if (low > high) throw ArgumentError('low must be <= high');
    final range = BigInt.from(high - low + 1);
    return low + (generate() % range).toInt();
  }

  void reset() => _state = _seed;
}

void main(List<String> args) {
  final generator = SecurePRNG(args.isEmpty ? 'hello' : args.first);
  for (var i = 0; i < 10; i++) {
    print(generator.generateInRange(1, 100));
  }
}`,
  },
} as const;

type Language = keyof typeof SOURCES;

const SourceCode = () => {
  const [language, setLanguage] = useState<Language>("python");
  const [copied, setCopied] = useState(false);
  const source = SOURCES[language];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(source.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-4xl mx-auto px-4 mb-12"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        <span className="gradient-text">Source Code</span>
      </h2>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="-mx-1 mb-5 overflow-x-auto px-1 pb-1">
          <div className="flex min-w-max gap-2" role="tablist" aria-label="Choose a source code language">
            {(Object.keys(SOURCES) as Language[]).map((key) => (
              <button
                key={key}
                id={`source-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={language === key}
                aria-controls="source-code-panel"
                onClick={() => {
                  setLanguage(key);
                  setCopied(false);
                }}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  language === key
                    ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                    : "border-glass-border bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {SOURCES[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex min-w-0 items-center gap-2">
            <Code className="h-5 w-5 shrink-0 text-neon-cyan" />
            <span className="truncate text-sm font-semibold text-foreground">{source.filename}</span>
            <span className="shrink-0 rounded-full bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground">
              {source.label}
            </span>
          </div>
          <button
            type="button"
            onClick={copyCode}
            aria-label={`Copy ${source.label} source code`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-neon-cyan" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div
          id="source-code-panel"
          role="tabpanel"
          aria-labelledby={`source-tab-${language}`}
          className="overflow-x-auto rounded-xl border border-glass-border bg-background/50 p-4"
        >
          <pre className="min-w-max text-xs font-mono leading-relaxed text-muted-foreground">
            <code>
              {source.code.split("\n").map((line, index) => (
                <span key={index} className="flex min-h-[1.25rem]">
                  <span className="w-8 shrink-0 select-none pr-3 text-right opacity-40">{index + 1}</span>
                  <span className={/^\s*(#|\/\/|\/\*|\*|<!--|--)/.test(line) ? "text-neon-blue/60" : ""}>
                    {line || " "}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </motion.section>
  );
};

export default SourceCode;
