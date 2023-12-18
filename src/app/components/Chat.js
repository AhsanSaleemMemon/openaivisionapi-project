import { useState, useRef } from 'react';
import styles from './styles/chatbox.module.css';
import { sendImageToOpenAI, sendTextToOpenAI } from '../../api/openApi';
import { encryptApiKey } from '@/utils/encrypt';
export default function Chat({ openaiAPIKey }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    try {
      let botResponse;
  
      if (uploadedImage) {
        botResponse = await sendImageToOpenAI(uploadedImage, userMessage, chatMessages);
        setUploadedImage(null);
        fileInputRef.current.value = '';
        setIsSendButtonDisabled(true);
      } else {
        botResponse = await sendImageToOpenAI(null, userMessage, chatMessages);
      }
  
      const userMessageData = { sender: 'user', text: userMessage, image: uploadedImage };
      const botMessageData = {
        sender: 'assistant',
        text: uploadedImage ? botResponse.data.choices[0].message.content : botResponse.data.choices[0].message.content,
      };
  
      setChatMessages([...chatMessages, userMessageData, botMessageData]);
      setUserMessage('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  const handleApiKeyChange = () => {
    const newApiKey = prompt('Enter the new API key:');
    if (newApiKey) {
      const encryptedKey = encryptApiKey(newApiKey);

      // setApiKey(newApiKey);
      window.localStorage.setItem('key', encryptedKey);
    }
  };
  const simulateBotResponse = async (userMessage) => {
    // Simulate an asynchronous delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Simulate a simple bot response
    const botResponse = {
      data: {
        choices: [
          {
            message: {
              content: `GPT-Bot: I received your message: "${userMessage}". This is a simulated response.`,
            },
          },
        ],
      },
    };
  
    return botResponse;
  };

  const simulateBotResponseWithImage = async (imagePath) => {
    // Simulate an asynchronous delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate a bot response with the image path
    return `GPT-Bot: I received your image. Path: ${imagePath}. This is a simulated response with the image.`;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const base64Image = await encodeImage(file);
      setUploadedImage(base64Image);
      setIsSendButtonDisabled(false); // Enable the Send button when an image is uploaded
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
        <div key={index} className={styles.message}>
          {message.sender === 'user' ? 'You: ' : 'Bot: '}
          {message.text}
          {message.image && (
            <div>
              <img
                src={message.image}
                alt="Uploaded"
                style={{ width: '25%', height: '25%', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
    <div className={styles.inputContainer}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.uploadButton}
        ref={fileInputRef}
      />
      <input
        type="text"
        value={userMessage}
        onChange={(e) => {
          setUserMessage(e.target.value);
          setIsSendButtonDisabled(!e.target.value && !uploadedImage);
        }}
        placeholder="Type your message..."
        className={styles.input}
      />
      <button
        onClick={handleSendMessage}
        className={styles.sendButton}
        disabled={isSendButtonDisabled}
      >
        Send
      </button>
    </div>
  </div>
  );
}
