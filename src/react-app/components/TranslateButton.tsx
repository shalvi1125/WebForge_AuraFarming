import { useState, useCallback } from 'react';
import { Languages } from 'lucide-react';

const TranslateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTranslate = useCallback(() => {
    const el = document.getElementById('google_translate_element');
    if (!el) return;

    const willOpen = el.style.display === 'none' || el.style.display === '';
    el.style.display = willOpen ? 'block' : 'none';
    el.style.visibility = willOpen ? 'visible' : 'hidden';
    el.style.pointerEvents = willOpen ? 'auto' : 'none';
    setIsOpen(willOpen);
  }, []);

  return (
    <button
      onClick={toggleTranslate}
      className={`fixed top-5 right-5 bg-white border p-2.5 rounded-lg shadow-md transition-all duration-200 z-[9998] ${
        isOpen ? 'border-[#4CC9F0] text-[#1B4F72] ring-2 ring-[#4CC9F0]/30' : 'border-[#071B34]/15 text-[#1B4F72] hover:border-[#4CC9F0]/40'
      }`}
      title="Translate Website"
      aria-label="Toggle language translator"
      aria-expanded={isOpen}
    >
      <Languages size={18} />
    </button>
  );
};

export default TranslateButton;
