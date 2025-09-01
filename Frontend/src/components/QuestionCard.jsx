import React from "react";
import { motion } from "framer-motion";

function QuestionCard({ question, options, onAnswer }) {
  return (
    <motion.div
      className="card p-3 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h4>{question}</h4>
      <div className="d-grid gap-2 mt-3">
        {options.map((opt, i) => (
          <button
            key={i}
            className="btn btn-outline-primary"
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default QuestionCard;
