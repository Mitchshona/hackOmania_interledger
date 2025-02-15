import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class OpenAIHelper {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async askChatGPTAboutImage({ base64Image, maxTokens = 350, prompt }) {
    return this.openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
    });
  }

  getResponseJSONString(response) {
    return response.choices[0].message.content;
  }

  cleanChatGPTJSONString(jsonString) {
    return jsonString.replace(/```json|```/g, '').trim();
  }

  parseChatGPTJSONString(jsonString) {
    if (!jsonString) return;
    const content = this.cleanChatGPTJSONString(jsonString);
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse ChatGPT response:', e);
      return null;
    }
  }
}