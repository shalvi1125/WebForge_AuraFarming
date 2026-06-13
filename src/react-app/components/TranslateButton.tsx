// src/react-app/components/TranslateButton.tsx
import { useState } from 'react';
import { Languages } from 'lucide-react';

const TranslateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTranslate = () => {
    setIsOpen(!isOpen);
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement) {
      translateElement.style.display = isOpen ? 'none' : 'block';
    }
  };

  return (
    <button
      onClick={toggleTranslate}
      className="fixed top-6 right-6 bg-white border border-gray-300 hover:border-amber-400 text-amber-700 p-2 rounded-lg shadow-sm transition-all duration-200 z-50"
      title="Translate Website"
    >
      <Languages size={18} />
    </button>
  );
};

export default TranslateButton;