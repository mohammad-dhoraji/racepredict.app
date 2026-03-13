import { motion } from "framer-motion";
import { LandingButton } from "./LandingButton";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        <span className="font-f1 text-sm font-bold tracking-[0.2em] text-foreground">
          GRID<span className="text-primary">LOCK</span>
        </span>
        <a href="/login">
          <LandingButton variant="racing" size="sm">
            Enter App
          </LandingButton>
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
