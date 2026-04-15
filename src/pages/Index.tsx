import { useState, useCallback } from "react";
import { SecurePRNG } from "@/lib/prng";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import SeedInput from "@/components/SeedInput";
import NumberGenerator from "@/components/NumberGenerator";
import OutputStream from "@/components/OutputStream";
import TestingPanel from "@/components/TestingPanel";
import ComparisonSection from "@/components/ComparisonSection";
import CryptoDemo from "@/components/CryptoDemo";
import Footer from "@/components/Footer";

const Index = () => {
  const [prng, setPrng] = useState<SecurePRNG | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);

  const handleInit = useCallback((newPrng: SecurePRNG) => {
    setPrng(newPrng);
    setNumbers([]);
  }, []);

  const handleGenerate = useCallback((num: number) => {
    setNumbers(prev => [...prev, num]);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <HeroSection />
      <SeedInput onInit={handleInit} />
      <NumberGenerator prng={prng} onGenerate={handleGenerate} />
      <OutputStream numbers={numbers} />
      <TestingPanel numbers={numbers} />
      <ComparisonSection />
      <CryptoDemo />
      <Footer />
    </div>
  );
};

export default Index;
