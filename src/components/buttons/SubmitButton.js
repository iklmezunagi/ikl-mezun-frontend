// components/buttons/SubmitButton.js
import React from 'react';
import '../../styles/button.css';

function SubmitButton({ text }) {
  return (
    <button type="submit" className="submit-button">
      {text}
    </button>
  );
}

export default SubmitButton;
