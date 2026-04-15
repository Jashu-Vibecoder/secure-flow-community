/**
 * SecurePRNG - SHA-256 Based Pseudo-Random Number Generator
 * TypeScript port of the Python implementation.
 * Uses synchronous approach with a simple hash function for browser compatibility.
 */

function sha256Sync(input: string): string {
  // Simple deterministic hash using a JS implementation
  // For demo purposes - produces 64-char hex strings
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const k = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];

  // Convert string to bytes
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) { bytes.push((c >> 6) | 192); bytes.push((c & 63) | 128); }
    else { bytes.push((c >> 12) | 224); bytes.push(((c >> 6) & 63) | 128); bytes.push((c & 63) | 128); }
  }

  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  // Append length as 64-bit big-endian
  for (let i = 56; i >= 0; i -= 8) bytes.push((bitLen >>> i) & 0xff);

  const rotr = (n: number, x: number) => ((x >>> n) | (x << (32 - n))) >>> 0;
  const add = (...args: number[]) => args.reduce((a, b) => (a + b) >>> 0, 0);

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const w: number[] = [];
    for (let i = 0; i < 16; i++) {
      w[i] = (bytes[offset + i * 4] << 24) | (bytes[offset + i * 4 + 1] << 16) |
             (bytes[offset + i * 4 + 2] << 8) | bytes[offset + i * 4 + 3];
      w[i] = w[i] >>> 0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i-15]) ^ rotr(18, w[i-15]) ^ (w[i-15] >>> 3);
      const s1 = rotr(17, w[i-2]) ^ rotr(19, w[i-2]) ^ (w[i-2] >>> 10);
      w[i] = add(w[i-16], s0, w[i-7], s1);
    }

    let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = add(h, S1, ch >>> 0, k[i], w[i]);
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = add(S0, maj);

      h = g; g = f; f = e; e = add(d, temp1);
      d = c; c = b; b = a; a = add(temp1, temp2);
    }

    h0 = add(h0, a); h1 = add(h1, b); h2 = add(h2, c); h3 = add(h3, d);
    h4 = add(h4, e); h5 = add(h5, f); h6 = add(h6, g); h7 = add(h7, h);
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map(v => v.toString(16).padStart(8, '0'))
    .join('');
}

export class SecurePRNG {
  private state: string;
  private seed: string;
  private callCount: number;

  constructor(seed: string) {
    if (!seed) throw new Error("Seed must be a non-empty string.");
    this.seed = seed;
    this.state = seed;
    this.callCount = 0;
  }

  generate(): bigint {
    const hash = sha256Sync(this.state);
    const number = BigInt("0x" + hash);
    this.state = hash;
    this.callCount++;
    return number;
  }

  generateInRange(low: number, high: number): number {
    if (low > high) throw new Error(`low (${low}) must be <= high (${high}).`);
    const raw = this.generate();
    const range = BigInt(high - low + 1);
    return low + Number(raw % range);
  }

  generateFloat(): number {
    const maxVal = BigInt(2) ** BigInt(256);
    return Number(this.generate() * BigInt(1000000) / maxVal) / 1000000;
  }

  generateHexKey(byteLength: number = 16): string {
    const hash = sha256Sync(this.state);
    this.state = hash;
    this.callCount++;
    return hash.slice(0, byteLength * 2);
  }

  getStats() {
    return { seed: this.seed, callCount: this.callCount };
  }

  reset() {
    this.state = this.seed;
    this.callCount = 0;
  }
}

// Randomness tests
export function frequencyTest(numbers: number[]): { zeros: number; ones: number; zeroRatio: number; oneRatio: number; balanced: boolean } {
  const binary = numbers.map(n => Math.abs(n).toString(2).padStart(32, '0')).join('');
  const zeros = (binary.match(/0/g) || []).length;
  const ones = (binary.match(/1/g) || []).length;
  const total = zeros + ones;
  const zeroRatio = zeros / total;
  const oneRatio = ones / total;
  return { zeros, ones, zeroRatio, oneRatio, balanced: Math.abs(zeroRatio - 0.5) < 0.05 };
}

export function repetitionTest(numbers: number[]): { total: number; unique: number; duplicates: number; uniqueRatio: number } {
  const unique = new Set(numbers).size;
  return { total: numbers.length, unique, duplicates: numbers.length - unique, uniqueRatio: unique / numbers.length };
}

export function distributionTest(numbers: number[], buckets: number = 10, range: number = 1000): number[] {
  const dist = new Array(buckets).fill(0);
  const bucketSize = range / buckets;
  numbers.forEach(n => {
    const idx = Math.min(Math.floor(n / bucketSize), buckets - 1);
    dist[idx]++;
  });
  return dist;
}

// Simple LCG for comparison (simulating Python's random)
export class SimpleLCG {
  private state: number;
  constructor(seed: number) {
    this.state = seed;
  }
  next(low: number, high: number): number {
    this.state = (this.state * 1664525 + 1013904223) & 0xffffffff;
    return low + (Math.abs(this.state) % (high - low + 1));
  }
}
