import { motion } from "framer-motion";

const steps = [
  { num: "01", label: "Create a group", detail: "Set up your private league in seconds" },
  { num: "02", label: "Share the link", detail: "Invite friends with a unique join code" },
  { num: "03", label: "Compete privately", detail: "Your own leaderboard, your own rivalry" },
];

const GroupsSection = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1fr] gap-16 items-start">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              Private Leagues
            </p>
            <h2 className="text-2xl md:text-3xl font-f1 font-bold text-foreground mb-4">
              BRING YOUR CREW
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Create private groups and settle the debate — who actually knows GridLock?
            </p>

            {/* Steps as minimal list */}
            <div className="space-y-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="border-t border-border py-4 flex gap-4"
                >
                      <span className="font-f1 text-[10px] text-muted-foreground/30 pt-0.5">
                        {step.num}
                      </span>
                      <div>
                        <h3 className="font-f1 text-xs font-bold uppercase tracking-[0.1em] text-foreground mb-1">
                          {step.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.detail}</p>
                      </div>
                </motion.div>
              ))}
              <div className="border-t border-border" />
            </div>
          </motion.div>

          {/* Right — invite token mock */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:pt-16"
          >
            <div className="border border-dashed border-border p-8">
              <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">
                Invite Token
              </p>
              <p className="font-f1 text-lg tracking-[0.3em] text-foreground">
                GR1D-X7K9
              </p>
              <p className="font-body text-xs text-muted-foreground mt-3">
                Share this code with your friends
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
