import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-zinc-800 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10 text-sm text-zinc-400">
        
        {/* Brand */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            F1 Podium Predictor
          </h3>
          <p className="leading-relaxed">
            A competitive Formula 1 race prediction game. 
            Predict podium finishers and Driver of the Day. 
            Climb the leaderboard. Prove your race IQ.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-medium mb-3">Navigation</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/predict" className="hover:text-white transition">
                Make Prediction
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-white transition">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/rules" className="hover:text-white transition">
                Scoring Rules
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-medium mb-3">Legal</h4>
          <p className="mb-3">
            This website is an independent fan-made project.
          </p>
          <p className="text-xs leading-relaxed">
            Formula 1, F1, and related marks are trademarks of 
            Formula One Licensing B.V.
          </p>
          <p className="text-xs mt-2 leading-relaxed">
            This is <span className="text-white font-semibold">
              NOT
            </span> an official Formula 1 product and is not affiliated 
            with Formula One Management.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} F1 Podium Predictor. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
