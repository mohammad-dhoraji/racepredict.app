import { motion } from "framer-motion";

const features = [
  {
    marker: "01",
    title: "Predict the Podium",
    description:
      "Pick P1, P2, P3 and Driver of the Day before every race. Lock in your predictions and prove your race knowledge.",
  },
  {
    marker: "02",
    title: "Compete with Friends",
    description:
      "Create private groups, share invite links, and battle head-to-head in your own leagues alongside the global competition.",
  },
  {
    marker: "03",
    title: "Climb the Leaderboard",
    description:
      "Points are calculated automatically after each race. Track your performance across the season on global and group rankings.",
  },
];

const WhatThisIs = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
            What this is
          </p>
          <h2 className="text-2xl md:text-3xl font-f1 font-bold text-foreground mb-4">
            NOT BETTING. NOT FANTASY.
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg">
            Pure competitive prediction. Test your GridLock insight against the grid.
          </p>
        </motion.div>

        {/* Editorial layout — stacked horizontal bands */}
        <div className="space-y-0">
          {features.map((feature, i) => (
            <motion.div
              key={feature.marker}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border-t border-border py-8 md:py-10 grid md:grid-cols-[80px_200px_1fr] gap-4 md:gap-8 items-start"
            >
              <span className="font-f1 text-xs text-muted-foreground/40">
                {feature.marker}
              </span>
              <h3 className="font-f1 text-xs font-bold uppercase tracking-[0.15em] text-foreground">
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
};

export default WhatThisIs;
