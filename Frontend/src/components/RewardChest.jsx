import React from "react";
import { FaGift } from "react-icons/fa";
import { motion } from "framer-motion";

function RewardChest({ reward }) {
  if (!reward) return null;
  return (
    <motion.div
      className="reward-chest mt-3 p-3 bg-warning rounded text-dark"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FaGift size={28} className="me-2" />
      ¡Has recibido una recompensa: <b>{reward}</b>!
    </motion.div>
  );
}
export default RewardChest;
