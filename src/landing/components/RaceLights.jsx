import { motion as Motion } from "framer-motion";

const RaceLights = ({ className = "" }) => {
  const lights = [0, 1, 2, 3, 4];

  return (
    <div className={`mb-12 flex justify-center gap-3 ${className}`.trim()}>
      {lights.map((i) => (
        <Motion.div
          key={i}
          className="flex flex-col gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.3, duration: 0.2 }}
        >
          <Motion.div
            className="w-4 h-4 rounded-full border border-border"
            animate={{
              backgroundColor: [
                "hsl(0 0% 10%)",
                "hsl(352 72% 50%)",
                "hsl(352 72% 50%)",
                "hsl(0 0% 10%)",
              ],
            }}
            transition={{
              delay: 1.0 + i * 0.3,
              duration: 2,
              times: [0, 0.1, 0.7, 1],
            }}
          />
          <Motion.div
            className="w-4 h-4 rounded-full border border-border"
            animate={{
              backgroundColor: [
                "hsl(0 0% 10%)",
                "hsl(352 72% 50%)",
                "hsl(352 72% 50%)",
                "hsl(0 0% 10%)",
              ],
            }}
            transition={{
              delay: 1.0 + i * 0.3,
              duration: 2,
              times: [0, 0.1, 0.7, 1],
            }}
          />
        </Motion.div>
      ))}
    </div>
  );
};

export default RaceLights;
