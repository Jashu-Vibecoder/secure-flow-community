import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";

interface Props {
  numbers: number[];
}

const OutputStream = ({ numbers }: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative z-10 max-w-xl mx-auto px-4 mb-12"
  >
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-lg font-semibold text-foreground">Live Output Stream</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{numbers.length} generated</span>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {numbers.slice().reverse().map((n, i) => (
            <motion.div
              key={`${numbers.length - i}-${n}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors font-mono text-sm"
            >
              <span className="text-xs text-muted-foreground w-8 text-right">#{numbers.length - i}</span>
              <span className="text-foreground">{n}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {numbers.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No numbers generated yet. Initialize PRNG and generate numbers.
          </p>
        )}
      </div>
    </div>
  </motion.section>
);

export default OutputStream;
