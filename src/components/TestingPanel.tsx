import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { frequencyTest, repetitionTest } from "@/lib/prng";

interface Props {
  numbers: number[];
}

const TestingPanel = ({ numbers }: Props) => {
  const freq = useMemo(() => numbers.length > 0 ? frequencyTest(numbers) : null, [numbers]);
  const rep = useMemo(() => numbers.length > 0 ? repetitionTest(numbers) : null, [numbers]);

  const freqData = freq ? [
    { name: "0s", value: freq.zeroRatio * 100, color: "hsl(217, 91%, 60%)" },
    { name: "1s", value: freq.oneRatio * 100, color: "hsl(270, 70%, 60%)" },
  ] : [];

  if (numbers.length < 5) {
    return (
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 mb-12">
        <div className="glass-card rounded-2xl p-6 text-center">
          <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Randomness Testing</h2>
          <p className="text-muted-foreground text-sm">Generate at least 5 numbers to see test results.</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative z-10 max-w-3xl mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        <span className="gradient-text">Randomness Testing</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Frequency Test */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-blue" />
            <h3 className="font-semibold text-foreground">Frequency Test</h3>
            {freq?.balanced ? (
              <CheckCircle className="w-4 h-4 text-neon-cyan ml-auto" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-destructive ml-auto" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Binary balance: 0s vs 1s should be ~50/50</p>

          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={freqData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" width={30} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {freqData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
            <span>0s: {freq?.zeroRatio.toFixed(4)}</span>
            <span>1s: {freq?.oneRatio.toFixed(4)}</span>
          </div>
        </div>

        {/* Repetition Test */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-purple" />
            <h3 className="font-semibold text-foreground">Repetition Test</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Measures uniqueness of generated values</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Numbers</span>
              <span className="font-mono text-foreground">{rep?.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unique Values</span>
              <span className="font-mono text-neon-cyan">{rep?.unique}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Duplicates</span>
              <span className="font-mono text-neon-purple">{rep?.duplicates}</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(rep?.uniqueRatio ?? 0) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {((rep?.uniqueRatio ?? 0) * 100).toFixed(1)}% unique
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TestingPanel;
