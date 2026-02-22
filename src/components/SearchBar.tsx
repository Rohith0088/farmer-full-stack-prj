import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useLanguage();

  const startVoiceSearch = (): void => {
    const win = window as any;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      const recognition: SpeechRecognitionInstance = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      recognition.start();
    } else {
      alert('Voice search not supported in this browser');
    }
  };

  return (
    <div className="search-bar">
      <span className="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
      <input
        type="text"
        placeholder={t('search')}
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button className="voice-btn" onClick={startVoiceSearch} title={t('voiceSearch')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </button>
    </div>
  );
};

export default SearchBar;
