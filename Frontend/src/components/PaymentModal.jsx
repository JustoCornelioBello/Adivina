// src/components/PaymentModal.jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../styles/modal.css"; // 👈 estilos agregados

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ pack, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔹 1. Crear PaymentIntent en backend
    const res = await fetch("http://localhost:8000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pack),
    });
    const { clientSecret } = await res.json();

    // 🔹 2. Confirmar pago
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    setLoading(false);

    if (result.error) {
      alert("❌ " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      onSuccess(pack);
      alert("✅ ¡Pago exitoso!");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Comprar {pack.amount}{" "}
        {pack.type === "coins" ? "Monedas 🪙" : "Diamantes 💎"}
      </h3>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "1rem" }}>
        Precio: <b>{pack.price}</b>
      </p>
      <CardElement className="card-element" />
      <button className="btn-pay" disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>
    </form>
  );
}

export default function PaymentModal({ open, pack, onClose, onSuccess }) {
  if (!open || !pack) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <Elements stripe={stripePromise}>
          <CheckoutForm pack={pack} onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
}
