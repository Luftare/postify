import { createBaseInstructions } from "../utils/languageUtils";

const SYSTEM_PROMPT =
  "You are a LinkedIn post enhancement expert specializing in professional social media content optimization. Always respond in the exact same language as the input text. Never translate or change the language of the content. You may freely change tone, style, professionalism, and other aspects as requested by the enhancement instructions. Focus on creating content that performs well on LinkedIn's professional networking platform.";

const API_CONFIG = {
  model: "gpt-4o",
  max_tokens: 700,
  temperature: 0.7,
};

/**
 * Process text with a preset enhancement
 * @param {Object} params - Parameters object
 * @param {string} params.apiKey - OpenAI API key
 * @param {string} params.currentText - Text to process
 * @param {Object} params.preset - Preset configuration with name and prompt
 * @returns {Promise<string>} - Processed text
 */
export const processWithPreset = async ({ apiKey, currentText, preset }) => {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (!currentText.trim()) {
    throw new Error("Please enter some text first!");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...API_CONFIG,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `${createBaseInstructions(currentText)}${
              preset.prompt
            }\n\nIMPORTANT: Respond in the same language as the input text below. Apply the enhancement while preserving the original language.\n\nOriginal post:\n"${currentText}"\n\nEnhanced post:`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const processedText = data.choices[0].message.content.trim();

    // Remove quotes if the response is wrapped in them
    const cleanedText = processedText.replace(/^["']|["']$/g, "");

    return cleanedText;
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};

/**
 * Process text with a custom prompt
 * @param {Object} params - Parameters object
 * @param {string} params.apiKey - OpenAI API key
 * @param {string} params.currentText - Text to process
 * @param {string} params.customPrompt - Custom enhancement prompt
 * @returns {Promise<string>} - Processed text
 */
export const processWithCustomPrompt = async ({
  apiKey,
  currentText,
  customPrompt,
}) => {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (!currentText.trim()) {
    throw new Error("Please enter some text first!");
  }

  if (!customPrompt.trim()) {
    throw new Error("Please enter a custom prompt!");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...API_CONFIG,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `${createBaseInstructions(
              currentText
            )}${customPrompt}\n\nIMPORTANT: Respond in the same language as the input text below. Apply the enhancement while preserving the original language.\n\nOriginal post:\n"${currentText}"\n\nEnhanced post:`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const processedText = data.choices[0].message.content.trim();

    // Remove quotes if the response is wrapped in them
    const cleanedText = processedText.replace(/^["']|["']$/g, "");

    return cleanedText;
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};
