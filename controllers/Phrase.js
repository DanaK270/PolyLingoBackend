import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MotivationalPhrase = () => {
  const [phrase, setPhrase] = useState('');
  const [language, setLanguage] = useState('en-us'); // Default to English (United States)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        // Make a GET request to the API
        const response = await axios.get(
          `http://phrases.thainanluizapis.com/motivational`,
          { params: { language } }
        );
        // Set the phrase data to state
        setPhrase(response.data.phrase);
      } catch (err) {
        setError('Failed to load the motivational phrase.');
        console.error(err);
      }
    };

    fetchPhrase();
  }, [language]); // Re-run if `language` changes

  return (
    <div>
      <h1>Motivational Phrase</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{phrase || 'Loading...'}</p>
      )}
      <button onClick={() => setLanguage('en-us')}>English</button>
      <button onClick={() => setLanguage('fr-fr')}>French</button>
    </div>
  );
};

export default MotivationalPhrase;
