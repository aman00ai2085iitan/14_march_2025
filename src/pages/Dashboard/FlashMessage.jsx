import React, { useEffect, useState } from "react";
import "./FlashMessage.css";

const FlashMessage = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`flash-message ${type}`}>
      {message}
    </div>
  );
};

export default FlashMessage;
