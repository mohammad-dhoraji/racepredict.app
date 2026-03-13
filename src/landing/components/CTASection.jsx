import { motion } from "framer-motion";
import { LandingButton } from "./LandingButton";

const CTASection = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="border-t border-border pt-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-f1 font-black text-foreground mb-4 leading-tight">
              THINK YOU CAN{" "}
              <span className="text-primary">PREDICT</span>{" "}
              THE GRID?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              Join thousands of GridLock fans competing every race weekend. Free to play. Hard to master.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="/login">
                <LandingButton variant="racing" size="lg">
                  Enter The Grid
                </LandingButton>
              </a>
              <a href="/login">
                <LandingButton variant="racingOutline" size="lg">
                  Create an Account
                </LandingButton>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
