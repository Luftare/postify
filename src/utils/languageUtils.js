// Helper function to detect if text is primarily non-English
export const detectLanguage = (text) => {
  const sample = text.trim().substring(0, 300).toLowerCase();

  // Enhanced heuristics for common non-English patterns
  const patterns = {
    // European languages with accents
    european: /[àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ]/,
    // Cyrillic (Russian, Ukrainian, Bulgarian, etc.)
    cyrillic: /[а-яёђѓєіїјљњћџ]/,
    // Chinese/Japanese/Korean
    cjk: /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/,
    // Arabic
    arabic: /[\u0600-\u06ff]/,
    // Hindi/Devanagari
    devanagari: /[\u0900-\u097f]/,
    // Thai
    thai: /[\u0e00-\u0e7f]/,
    // Hebrew
    hebrew: /[\u0590-\u05ff]/,
    // Greek
    greek: /[\u0370-\u03ff]/,
    // Turkish specific characters
    turkish: /[çğıöşü]/,
    // Portuguese/Spanish specific patterns
    iberian: /[ñáéíóúü]/,
  };

  // Count non-English character occurrences
  let nonEnglishScore = 0;
  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = sample.match(pattern);
    if (matches) {
      nonEnglishScore += matches.length;
    }
  }

  // If more than 2 non-English characters found, likely non-English
  return nonEnglishScore > 2 ? "non-english" : "unknown";
};

// Create dynamic base instructions based on detected language
export const createBaseInstructions = (inputText) => {
  const detectedLang = detectLanguage(inputText);
  const isNonEnglish = detectedLang === "non-english";

  if (isNonEnglish) {
    return `You are a LinkedIn post enhancement expert specializing in optimizing professional social media content for maximum engagement and impact.

CRITICAL INSTRUCTION: The input text is written in a non-English language. You MUST respond in the EXACT SAME LANGUAGE as the input text. Do NOT translate or change the language of the response in any way.
CRITICAL INSTRUCTION: Never use dash (–) in your response. Instead split the sentence or use a comma.

Your task is to enhance the given LinkedIn post while:
1. PRESERVING the original language completely
2. Maintaining professional LinkedIn standards and best practices
3. Applying the specific enhancement instructions below (which may change tone, style, professionalism, etc.)

Enhancement instructions:

`;
  } else {
    return `You are a LinkedIn post enhancement expert specializing in optimizing professional social media content for maximum engagement and impact.

Your task is to enhance the given LinkedIn post according to the specific instructions below. You may change tone, style, professionalism, and other aspects as requested while maintaining LinkedIn's professional standards.

Enhancement instructions:

`;
  }
};
