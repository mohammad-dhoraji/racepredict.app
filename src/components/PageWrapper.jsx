import { motion } from "framer-motion";
import Footer from "./Footer";
import Loader from "./Loader";
import { useLoading } from "../context/LoadingContext";

export default function PageWrapper({ children }) {
  const { loading } = useLoading();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen flex flex-col bg-neutral-800 text-white w-full"
    >
      <div className="flex-1">{children}</div>
      <Footer />

      {loading && (
        <div className="absolute inset-0 z-50">
          <Loader />
        </div>
      )}
    </motion.div>
  );
}
