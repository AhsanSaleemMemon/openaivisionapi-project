"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Chat from './components/Chat';
import Modal from './components/Modal';
import { encryptApiKey, decryptApiKey } from '@/utils/encrypt';
export default function Home() {
  const [openaiAPIKey, setOpenaiAPIKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if OpenAI API key is stored in the cache
    const cachedAPIKey = localStorage.getItem('key');
    
    if (cachedAPIKey) {
      const decryptedKey = decryptApiKey(cachedAPIKey);
      setOpenaiAPIKey(decryptedKey);
    } else {
      // If not, show the setup modal
      setShowModal(true);
    }
  }, []);

  const handleAPIKeySetup = (apiKey) => {
    // Save the API key to the cache
    const encryptedKey = encryptApiKey(apiKey);
    localStorage.setItem('key', encryptedKey);
    setOpenaiAPIKey(encryptedKey);
    setShowModal(false);
  };


  const isIOS = () => {
    return (
      !window.MSStream &&
      /iPad|iPhone|iPod/i.test(navigator.userAgent)
    );
  };

  
  const handleOpenModal = () => {
    setShowModal(true);
  };
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        {/* ... existing code ... */}
      </div>

      <div className={styles.center}>
       <h1>Image Explain with GPT4</h1>
       <p>is Ios : {isIOS()}</p>
      </div>

      <div className={styles.grid}>
        {/* ... existing code ... */}
      </div>

      {/* Chat UI */}
      {openaiAPIKey && <Chat openaiAPIKey={openaiAPIKey} />}
      {!openaiAPIKey && (
        <div className={styles.apiKeyButton}>
          <button onClick={handleOpenModal}>Set API Key</button>
        </div>
      )}
      {/* API setup modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <p className={styles.modalText}>Please set up your OpenAI API key:</p>
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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
    <label className={styles.modalText} >
      API Key:
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className={styles.inputField}
      />
    </label>
    <button type="submit" className={styles.submitButton}>
      Submit 
      
    </button>
  </form>
  );
}
