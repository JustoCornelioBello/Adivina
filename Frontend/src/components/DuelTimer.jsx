import React, { useEffect, useState } from "react";

export default function DuelTimer({ seconds, onTimeOut }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) {
      onTimeOut();
      return;
    }
    const id = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(id);
  }, [time]);

  return <h4>⏱ Tiempo restante: {time}s</h4>;
}
