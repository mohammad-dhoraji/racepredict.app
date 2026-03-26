import { GridLockLogo } from "../../components/branding";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <GridLockLogo size={24} />
          <p className="text-white/60 text-sm">
            Precision predictions for Formula 1.
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/30 uppercase tracking-wider">
          Not affiliated with Formula 1 or FIA
        </p>
        <a href="/privacy" className="ont-mono text-[10px] text-muted-foreground/30 uppercase tracking-wider">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
