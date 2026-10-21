# 🛡️ Secure Flow — SHA-256 PRNG Generator

**Secure Flow** is an interactive web app that demonstrates how to build a deterministic, hash-based pseudo-random number generator (PRNG) using SHA-256 — seed it, generate numbers, visualize how random they really are, and compare them against a classic Linear Congruential Generator (LCG), all in the browser.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Seed Input** — Initialize the generator with any custom seed string
- **Number Generator** — Generate pseudo-random integers within a chosen min/max range
- **Live Output Stream** — Watch every generated number appear in a running history
- **Randomness Testing** — Built-in frequency test (bit balance) and repetition test (uniqueness), each with live charts
- **Distribution Comparison** — Visual side-by-side of the SHA-256 PRNG's output distribution vs. a standard LCG
- **Crypto Demo** — See a PRNG-derived key/IV drive a simple encrypt → ciphertext → decrypt flow
- **Multi-language Source Code** — Switch between JavaScript, Python, TypeScript, Kotlin, Java, HTML/CSS, and Dart examples
- Animated UI with Framer Motion and a particle background

## 🧠 How It Works

The core generator (`src/lib/prng.ts`) repeatedly hashes its own state:

1. Start from a seed string.
2. Hash the current state with SHA-256 → the digest becomes the next output number.
3. Feed that same digest back in as the new state.
4. Repeat for every subsequent number requested.

This makes the sequence **deterministic** — the same seed always reproduces the same sequence — while being computationally hard to predict from the outputs alone. That makes it well suited for reproducible simulations, tests, and teaching how hash-based generators work.

> **Note on the "Crypto Demo":** it uses a simple XOR cipher (not real AES) to illustrate deriving a key/IV from the PRNG and running an encrypt/decrypt round trip. This project is for education and demonstration — for production cryptography, use an audited library and your platform's CSPRNG (e.g. `crypto.getRandomValues` in the browser, or Python's `secrets`/`os.urandom`) rather than this generator.

## 🛠️ Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool & dev server
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Recharts](https://recharts.org/) — data visualization
- [React Router](https://reactrouter.com/) · [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) · [TanStack Query](https://tanstack.com/query)
- [Vitest](https://vitest.dev/) + Testing Library — unit tests

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/), since a `bun.lock` is included)

### Installation
```bash
git clone https://github.com/Jashu-Vibecoder/secure-flow.git
cd secure-flow
npm install
```

### Development
```bash
npm run dev
```
Then open the local URL Vite prints in your terminal (defaults to `http://localhost:5173`).

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## 📁 Project Structure

```
secure-flow/
├── src/
│   ├── components/     # HeroSection, SeedInput, NumberGenerator, TestingPanel, etc.
│   │   └── ui/          # shadcn/ui primitives
│   ├── hooks/           # Custom React hooks
│   ├── lib/
│   │   ├── prng.ts      # SecurePRNG, SimpleLCG, and randomness tests
│   │   └── utils.ts
│   ├── pages/            # Route-level pages
│   └── test/              # Vitest setup & tests
├── public/
└── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome — feel free to open an issue or submit a PR.

## 📄 License

No license has been added to this repository yet. If you intend for others to use or contribute to this code, consider adding one (e.g. [MIT](https://choosealicense.com/licenses/mit/)).
