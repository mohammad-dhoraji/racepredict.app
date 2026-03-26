export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="max-w-3xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-f1 font-bold uppercase tracking-tight mb-10">
          Privacy Policy
        </h1>

        {/* Content */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed">

          <Section title="1. Information We Collect">
            <p>
              We collect basic account information such as your name and email
              when you sign in using Google authentication.
            </p>
            <p className="mt-2">
              We also store your predictions, group activity, and leaderboard data
              to power the core features of the app.
            </p>
          </Section>

          <Section title="2. How We Use Your Data">
            <p>Your data is used to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Create and manage your account</li>
              <li>Enable predictions and scoring</li>
              <li>Display leaderboards and groups</li>
              <li>Improve app performance and experience</li>
            </ul>
          </Section>

          <Section title="3. Authentication">
            <p>
              Authentication is handled securely via Google OAuth through Supabase.
              We do not store or access your passwords.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p>
              We do not sell, trade, or share your personal data with third parties.
            </p>
          </Section>

          <Section title="5. Data Storage">
            <p>
              Your data is securely stored and only used for application
              functionality.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              You may request deletion of your account and data at any time by
              contacting us.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>For any questions or concerns, contact:</p>
            <p className="mt-2 font-mono text-xs tracking-wider">
              contact@gridlock.site
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground font-mono tracking-wider">
          LAST UPDATED: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-f1 font-bold uppercase tracking-wide mb-3">
        {title}
      </h2>
      <div className="text-muted-foreground">
        {children}
      </div>
    </div>
  );
}