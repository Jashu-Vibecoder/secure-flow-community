import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { GitCompare } from "lucide-react";
import { SecurePRNG, SimpleLCG, distributionTest } from "@/lib/prng";

const ComparisonSection = () => {
  const data = useMemo(() => {
    const prng = new SecurePRNG("comparison_demo");
    const lcg = new SimpleLCG(42);
    const prngNums = Array.from({ length: 500 }, () => prng.generateInRange(0, 999));
    const lcgNums = Array.from({ length: 500 }, () => lcg.next(0, 999));
    const prngDist = distributionTest(prngNums);
    const lcgDist = distributionTest(lcgNums);
    return prngDist.map((v, i) => ({
      bucket: `${i * 100}-${(i + 1) * 100}`,
      "SHA-256 PRNG": v,
      "Standard LCG": lcgDist[i],
    }));
  }, []);

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative z-10 max-w-3xl mx-auto px-4 mb-12">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <GitCompare className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-semibold text-foreground">Distribution Comparison</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-6">SHA-256 PRNG vs Standard LCG — 500 samples, range [0, 999]</p>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="bucket" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 25%)", borderRadius: "12px", color: "hsl(210, 40%, 95%)" }}
            />
            <Bar dataKey="SHA-256 PRNG" radius={[4, 4, 0, 0]} barSize={16}>
              {data.map((_, i) => <Cell key={i} fill="hsl(217, 91%, 60%)" />)}
            </Bar>
            <Bar dataKey="Standard LCG" radius={[4, 4, 0, 0]} barSize={16}>
              {data.map((_, i) => <Cell key={i} fill="hsl(270, 70%, 60%)" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-blue" />
            <span className="text-muted-foreground">SHA-256 PRNG</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple" />
            <span className="text-muted-foreground">Standard LCG</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ComparisonSection;
