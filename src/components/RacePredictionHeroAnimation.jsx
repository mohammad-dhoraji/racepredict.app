import React, { useState } from 'react';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import RotatingText from './RotatingText';

const drivers = [
  "Max Verstappen",
  "Lewis Hamilton", 
  "Charles Leclerc",
  "Lando Norris",
  "George Russell",
  "Kimi Antonelli"
];

const driverColors = {
  "Max Verstappen": "#003773",   // Red Bull blue
  "Lewis Hamilton": "#E80020",   // Mercedes teal
  "Charles Leclerc": "#E80020",  // Ferrari red
  "Lando Norris": "#FF8700",     // McLaren orange
  "George Russell": "#27F4D2",   // Mercedes
  "Kimi Antonelli": "#27F4D2"    // placeholder (Merc junior)
};

const RacePredictionHeroAnimation = ({ trackName = "this weekend", className = "" }) => {
  const [activeDriver, setActiveDriver] = useState(drivers[0]);
  return (
    <motion.div
      className={`relative hidden min-h-105 lg:flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ filter: "brightness(1.05)" }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Subtle trophy background SVG - watermark effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.svg
          className="w-full h-full opacity-[0.10] "
          viewBox="0 0 512 512"
          preserveAspectRatio="xMidYMid meet"
          animate={{ y: [0, -4, 0] }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            repeatType: "loop",
            ease: "easeInOut"
          }}
        >
          <path style={{fill: '#EEBF00'}} d="M193.341,333.083l35.307,111.079c-26.654,10.991-45.42,37.218-45.42,67.839h146.724	c0-30.621-18.767-56.848-45.42-67.839l35.995-111.079H193.341z"/>
          <path style={{opacity: 0.31, fill: '#664400'}} d="M284.533,444.162l35.995-111.079h-0.078h-21.997H193.263	l13.845,43.557c15.049,3.811,31.765,5.936,49.369,5.936c9.1,0,17.956-0.575,26.473-1.651l-20.491,63.237	c26.654,10.991,45.42,37.218,45.42,67.839h22.075C329.952,481.38,311.187,455.152,284.533,444.162z"/>
          <g>
            <polygon style={{fill: '#EEBF00'}} points="116.73,72.661 21.441,72.661 21.441,46.284 135.896,46.284 135.896,76.234 "/>
            <polygon style={{fill: '#EEBF00'}} points="45.257,46.284 45.257,174.434 21.441,118.84 21.441,46.284 "/>
          </g>
          <path style={{fill: '#DDB200'}} d="M129.165,282.957c-28.943,0-54.854-17.255-66.012-43.96L14.207,121.862	c-0.4-0.958-0.606-1.984-0.606-3.023V46.283c0-4.331,3.51-7.84,7.84-7.84h95.289c4.33,0,7.84,3.509,7.84,7.84s-3.51,7.84-7.84,7.84	H29.281v63.144l48.338,115.684c8.713,20.851,28.945,34.325,51.545,34.325c4.33,0,7.84,3.509,7.84,7.84	C137.005,279.447,133.494,282.957,129.165,282.957z"/>
          <g>
            <polygon style={{fill: '#EEBF00'}} points="395.271,72.661 490.56,72.661 490.56,46.284 376.105,46.284 376.105,76.234 "/>
            <polygon style={{fill: '#EEBF00'}} points="466.745,46.284 466.745,174.434 490.56,118.84 490.56,46.284 "/>
          </g>
          <path style={{fill: '#DDB200'}} d="M382.838,282.957c28.943,0,54.854-17.255,66.012-43.96l48.944-117.135	c0.4-0.958,0.606-1.984,0.606-3.023V46.283c0-4.331-3.51-7.84-7.84-7.84h-95.289c-4.33,0-7.84,3.509-7.84,7.84s3.51,7.84,7.84,7.84	h87.448v63.144l-48.338,115.684c-8.713,20.851-28.945,34.325-51.545,34.325c-4.33,0-7.84,3.509-7.84,7.84	C374.996,279.447,378.507,282.957,382.838,282.957z"/>
          <path style={{fill: '#EEBF00'}} d="M396.45,0v217.633c0,76.923-62.937,139.86-139.86,139.86l0,0c-76.923,0-139.86-62.937-139.86-139.86	V0H396.45z"/>
          <rect x="116.727" y="80.285" style={{fill: '#DDB200'}} width="279.72" height="142.202"/>
          <rect x="116.727" y="102.729" style={{fill: '#FFEB99'}} width="279.72" height="95.317"/>
          <path style={{opacity: 0.14, fill: '#664400'}} d="M359.335,0v198.111c0,76.923-62.937,139.86-139.86,139.86	l0,0c-15.683,0-30.784-2.618-44.889-7.436c23.13,16.93,51.589,26.957,82.28,26.957l0,0c76.923,0,139.86-62.937,139.86-139.86V0	H359.335z"/>
          <path style={{opacity: 0.4, fill: '#FFEB99'}} d="M151.401,309.467c19.402,22.195,45.667,38.252,75.395,44.784	V0h-75.395V309.467z"/>
        </motion.svg>
      </motion.div>

      {/* Headline */}
      <h2 className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-f1 font-black uppercase tracking-tight text-zinc-100 mb-6 text-center px-4 drop-shadow-lg">
       Who will win at
        <span className="block text-transparent bg-linear-to-r from-red-400 via-red-300 to-yellow-400 bg-clip-text">
          {trackName}?
        </span>
      </h2>

      {/* Dynamic rotating pill */}
      <motion.div 
        className="relative z-20 isolate px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold text-base md:text-lg lg:text-xl tracking-wide overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_30px_60px_rgba(30,65,255,0.5)]"
        animate={{ 
          backgroundColor: driverColors[activeDriver],
          boxShadow: `0 25px 50px ${driverColors[activeDriver].replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).slice(0,3).join(',') + '40'}`
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <RotatingText
          texts={drivers}
          onNext={(index) => setActiveDriver(drivers[index])}
          mainClassName=""
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-1 md:pb-1.5"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2200}
        />
      </motion.div>

      {/* Subtle glow effect */}
      {/* <div className="absolute -inset-2 bg-linear-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl blur-xl opacity-75 animate-pulse" /> */}
    </motion.div>
  );
};

export default RacePredictionHeroAnimation;

