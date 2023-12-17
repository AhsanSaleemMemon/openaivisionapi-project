
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Chat from './components/Chat';
import Modal from './components/Modal';

export default function Home() {
  const [openaiAPIKey, setOpenaiAPIKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if OpenAI API key is stored in the cache
    const cachedAPIKey = localStorage.getItem('openaiAPIKey');
    if (cachedAPIKey) {
      setOpenaiAPIKey(cachedAPIKey);
    } else {
      // If not, show the setup modal
      setShowModal(true);
    }
  }, []);

  const handleAPIKeySetup = (apiKey) => {
    // Save the API key to the cache
    localStorage.setItem('openaiAPIKey', apiKey);
    setOpenaiAPIKey(apiKey);
    setShowModal(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {/* ... existing code ... */}
      </div>

      <div className={styles.center}>
       <h1>Image Explain with GPT4</h1>
      </div>

      <div className={styles.grid}>
        {/* ... existing code ... */}
      </div>

      {/* Chat UI */}
      {openaiAPIKey && <Chat openaiAPIKey={openaiAPIKey} />}

      {/* API setup modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <p>Please set up your OpenAI API key:</p>
          <ApiKeySetupForm onSubmit={handleAPIKeySetup} />
        </Modal>
      )}
    </main>
  );
}

function ApiKeySetupForm({ onSubmit }) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        API Key:
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
