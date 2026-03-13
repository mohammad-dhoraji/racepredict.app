const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-f1 text-xs tracking-[0.2em] text-muted-foreground/40">
          GRID<span className="text-primary/60">LOCK</span>
        </span>
        <p className="font-mono text-[10px] text-muted-foreground/30 uppercase tracking-wider">
          Not affiliated with Formula 1 or FIA
        </p>
      </div>
    </footer>
  );
};

export default Footer;
