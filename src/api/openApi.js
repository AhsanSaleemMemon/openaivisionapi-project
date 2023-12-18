// openaiApi.js
import axios from 'axios';
import { decryptApiKey } from '@/utils/encrypt';
// const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';


export function encodeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export async function sendTextToOpenAI(userMessage) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  
  const payload = {
    model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'user',
      content: userMessage, // This should be an array or object containing the user message
    },
  ],
  max_tokens: 150,
  temperature: 0.9,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ['\n', ' Human:', ' AI:'],
  };
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      { headers }
    );
  
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error('An error occurred while communicating with the OpenAI API.');
    }
  }
}
export async function sendImageToOpenAI(file, userMessage, chatMessages) {
  const encryptedKey = window.localStorage.getItem('key'); // Retrieve encrypted API key from localStorage
  const apiKey = decryptApiKey(encryptedKey); // Retrieve API key from localStorage

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  let payload;

  if (file) {
    const base64Image = file; // Assuming file contains base64 image data

    payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        ...chatMessages.map((message) => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: [
            { type: 'text', text: message.text || '' }, // Ensure text is not null
            ...(message.image ? [{ type: 'image_url', image_url: { url: message.image } }] : []),
          ],
        })),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userMessage,
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 3500,
    };
  } else {
    payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        ...chatMessages.map((message) => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: [
            { type: 'text', text: message.text || '' }, // Ensure text is not null
            ...(message.image ? [{ type: 'image_url', image_url: { url: message.image } }] : []),
          ],
        })),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userMessage,
            },
          ],
        },
      ],
      max_tokens: 3500,
    };
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error('An error occurred while communicating with the OpenAI API.');
    }
  }
}
