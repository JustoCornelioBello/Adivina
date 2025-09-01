import React from "react";
import { useLocation, Link } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const { score, total } = state || { score: 0, total: 0 };

  return (
    <div className="container text-center mt-5">
      <h2>Resultado Final</h2>
      <p>
        Tu puntaje: <b>{score}</b> de {total}
      </p>
      <Link to="/" className="btn btn-success">
        Volver al inicio
      </Link>
    </div>
  );
}

export default Result;
