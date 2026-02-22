import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { languageNames } from '../i18n/translations';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="language-selector">
      <button className="lang-btn" onClick={() => setIsOpen(!isOpen)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 4}}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>{languageNames[language]}
      </button>
      {isOpen && (
        <div className="lang-dropdown">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              className={`lang-option ${language === code ? 'active' : ''}`}
              onClick={() => { setLanguage(code); setIsOpen(false); }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
