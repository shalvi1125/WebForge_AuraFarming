import { useState, useCallback, useEffect } from 'react';
import { Languages } from 'lucide-react';

const TranslateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const el = document.getElementById('google_translate_element');
    if (el) {
      if (isOpen) {
        el.classList.add('is-open');
      } else {
        el.classList.remove('is-open');
      }
    }
  }, [isOpen]);

  const toggleTranslate = useCallback(() => {
    const el = document.getElementById('google_translate_element');
    if (!el) return;

    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      el.classList.add('is-open');
      // Google updated widget markup — menu trigger is aria-haspopup link, not .goog-te-menu-value
      const openLanguageMenu = () => {
        const trigger =
          (el.querySelector('a[aria-haspopup="true"]') as HTMLElement | null) ??
          (el.querySelector('.goog-te-gadget-simple a') as HTMLElement | null);
        trigger?.click();
      };
      requestAnimationFrame(() => {
        openLanguageMenu();
        // Retry once if the gadget script loads after first paint
        window.setTimeout(openLanguageMenu, 150);
      });
    } else {
      el.classList.remove('is-open');
    }
  }, [isOpen]);

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
