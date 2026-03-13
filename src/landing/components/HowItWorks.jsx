import { motion } from "framer-motion";

const steps = [
  { num: "01", label: "Pick P1, P2, P3", detail: "Select your predicted podium finishers" },
  { num: "02", label: "Choose Driver of the Day", detail: "Back the driver you think will shine" },
  { num: "03", label: "Predictions lock at race start", detail: "No changes once lights go out" },
  { num: "04", label: "Results processed automatically", detail: "Points calculated from official data" },
  { num: "05", label: "Leaderboards update instantly", detail: "See where you stand in real-time" },
];

const HowItWorks = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
            Sequence
          </p>
          <h2 className="text-2xl md:text-3xl font-f1 font-bold text-foreground">
            HOW IT WORKS
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical track line */}
          <motion.div
            className="absolute left-[15px] top-0 bottom-0 w-px bg-border"
            initial={{ scaleY: 0, transformOrigin: "top" }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-6 py-5"
              >
                {/* Node dot */}
                <div className="relative flex-shrink-0 w-8 flex justify-center pt-1">
                  <div className="w-[7px] h-[7px] rounded-full bg-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:gap-6">
                    <div className="flex items-baseline gap-3 md:w-72 flex-shrink-0">
                      <span className="font-f1 text-[10px] text-muted-foreground/30">
                        {step.num}
                      </span>
                      <h3 className="font-f1 text-xs font-bold uppercase tracking-[0.1em] text-foreground">
                        {step.label}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 md:mt-0">
                      {step.detail}
                    </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
