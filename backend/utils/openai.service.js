import { OpenAIHelper } from "./openai.js";
import { isBase64Image } from "./data.js";

export class OpenaiService {
  constructor(openAIHelper) {
    this.openAIHelper = openAIHelper || new OpenAIHelper();
  }

  async validateImage(image) {
    if (!isBase64Image(image)) {
      throw new Error("Invalid image format");
    }

    const prompt = `
      Given the uploaded image, extract and analyze the screen time information. Provide a summary of the total screen time, along with any notable usage patterns, and identify the categories or apps consuming the most time.
      Please respond always and uniquely with the following JSON object:
      {
        "descriptionOfAnalysis": "{analysis}" // Indicate your analysis of the image and why it satisfies or not the criteria.
        "dailyScreenTime": "{screenTime}" // Output the daily screen time in minutes
        ""
      }
    `;

    try {
      const gptResponse = await this.openAIHelper.askChatGPTAboutImage({
        base64Image: image.split(",")[1], // Remove the data:image/jpeg;base64, part
        prompt,
      });

      const responseJSONStr =
        this.openAIHelper.getResponseJSONString(gptResponse);
      return this.openAIHelper.parseChatGPTJSONString(responseJSONStr);
    } catch (error) {
      console.error("Error in validateImage:", error);
      throw error;
    }
  }
}
