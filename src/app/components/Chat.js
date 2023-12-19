import { useState, useRef, useEffect } from 'react';
import styles from './styles/chatbox.module.css';
import { sendImageToOpenAI, sendTextToOpenAI } from '../../api/openApi';
import { encryptApiKey } from '@/utils/encrypt';
import Image from 'next/image';

export default function Chat({ openaiAPIKey }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsSendButtonDisabled(!userMessage && !uploadedImage);
  }, [userMessage, uploadedImage]);

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      let botResponse;

      if (uploadedImage) {
        botResponse = await sendImageToOpenAI(uploadedImage, userMessage, chatMessages);
        setUploadedImage(null);
        setImageName('');
        fileInputRef.current.value = '';
        setIsSendButtonDisabled(true);
      } else {
        botResponse = await sendImageToOpenAI(null, userMessage, chatMessages);
      }

      const userMessageData = { sender: 'user', text: userMessage, image: uploadedImage };
      const botMessageData = {
        sender: 'assistant',
        text: uploadedImage ? botResponse.data.choices[0].message.content : botResponse.data.choices[0].message.content,
        image: uploadedImage,
      };

      setChatMessages([...chatMessages, userMessageData, botMessageData]);
      setUserMessage('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = () => {
    const newApiKey = prompt('Enter the new API key:');
    if (newApiKey) {
      const encryptedKey = encryptApiKey(newApiKey);
      window.localStorage.setItem('key', encryptedKey);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const base64Image = await encodeImage(file);
      setUploadedImage(base64Image);
      setImageName(file.name); // Set the uploaded image name
      setIsSendButtonDisabled(false);
    }
  };

  const encodeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.apiKeyChange}>
        <button className={styles.changeKeyButton} onClick={handleApiKeyChange}>
          Change API Key
        </button>
      </div>
      <div className={styles.chatMessages}>
        {chatMessages.map((message, index) => (
          <div key={index} className={styles.messageContainer}>
            {message.sender === 'user' ? (
              <div className={styles.userMessage}>
                {message.text}
                {message.image && (
                  <div className={styles.userImage}>
                    <Image src={message.image} alt="Uploaded" width={100} height={100} />
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.botMessage}>{message.text}</div>
            )}
          </div>
        ))}
        {isLoading && <div className={styles.loader}></div>}
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.uploadButtonContainer}>
        <label htmlFor="fileInput" className={styles.uploadButton}>
  {imageName ? 
    (imageName.length > 8 ? 
      `${imageName.substring(0, 5)}..${imageName.substring(imageName.lastIndexOf('.') - 2)}` :
      imageName
    ) 
    : 'Upload Image'}
</label>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
            ref={fileInputRef}
          />
        </div>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button
          onClick={handleSendMessage}
          className={`${styles.sendButton} ${isSendButtonDisabled ? styles.disabledButton : ''}`}
          disabled={isSendButtonDisabled || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
