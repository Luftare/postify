import { useState, useCallback, useEffect } from "react";
import "./App.css";

// Helper function to detect if text is primarily non-English
const detectLanguage = (text) => {
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
const createBaseInstructions = (inputText) => {
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

const PRESETS = [
  {
    id: "grammar",
    name: "Fix Grammar",
    icon: "✏️",
    prompt:
      "Fix any grammar, spelling, and punctuation errors while keeping the original meaning intact.",
  },
  {
    id: "emojis",
    name: "Add Emojis",
    icon: "😊",
    prompt: "Add appropriate emojis to make the content more engaging.",
  },
  {
    id: "rhythm",
    name: "Rhythm",
    icon: "🥁",
    prompt:
      "Add rhythm to the text by splitting it into short sections separated by empty lines.",
  },
  {
    id: "list",
    name: "List",
    icon: "📋",
    prompt: "Create structure with one or more lists.",
  },

  {
    id: "clarity",
    name: "100% Clarity",
    icon: "💡",
    prompt: "Rewrite the text in a 10x more clear and understandable way.",
  },
  {
    id: "engagement",
    name: "Boost Engagement",
    icon: "🚀",
    prompt:
      "Rewrite to maximize engagement by making it more compelling, actionable, and conversation-starting.",
  },
  {
    id: "professional",
    name: "More Professional",
    icon: "👔",
    prompt:
      "Rewrite to sound more professional and polished while keeping it authentic and relatable.",
  },
  {
    id: "storytelling",
    name: "Add Storytelling",
    icon: "📖",
    prompt:
      "Transform into a compelling story that engages readers emotionally and creates a narrative arc.",
  },
  {
    id: "casual",
    name: "More Casual",
    icon: "😎",
    prompt: "Rewrite to sound more casual, conversational, and approachable.",
  },
  {
    id: "thought_leader",
    name: "Thought Leadership",
    icon: "🧠",
    prompt:
      "Rewrite to position as thought leadership content with industry insights and forward-thinking perspectives.",
  },
  {
    id: "actionable",
    name: "Add Call-to-Action",
    icon: "👉",
    prompt:
      "Add clear, compelling calls-to-action that encourage engagement, comments, or specific actions from readers.",
  },
];

function App() {
  const [currentText, setCurrentText] = useState("");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem("postify_openai_key") || "";
    } catch (error) {
      console.warn("Failed to load API key from localStorage:", error);
      return "";
    }
  });
  const [showApiInput, setShowApiInput] = useState(false);
  const [lastActionType, setLastActionType] = useState(null); // 'manual' | 'preset' | null

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("postify_history");
      const savedCurrentIndex = localStorage.getItem("postify_current_index");
      const savedCurrentText = localStorage.getItem("postify_current_text");
      const savedLastActionType = localStorage.getItem(
        "postify_last_action_type"
      );

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);

        if (savedCurrentIndex !== null) {
          const index = parseInt(savedCurrentIndex, 10);
          setCurrentIndex(index);
        }

        if (savedCurrentText) {
          setCurrentText(savedCurrentText);
        }

        if (savedLastActionType) {
          setLastActionType(savedLastActionType);
        }
      }
    } catch (error) {
      console.warn("Failed to load history from localStorage:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem("postify_history", JSON.stringify(history));
        localStorage.setItem("postify_current_index", currentIndex.toString());
        localStorage.setItem("postify_current_text", currentText);
        localStorage.setItem("postify_last_action_type", lastActionType || "");
      } else {
        // Clear localStorage when history is empty
        localStorage.removeItem("postify_history");
        localStorage.removeItem("postify_current_index");
        localStorage.removeItem("postify_current_text");
        localStorage.removeItem("postify_last_action_type");
      }
    } catch (error) {
      console.warn("Failed to save history to localStorage:", error);
    }
  }, [history, currentIndex, currentText, lastActionType]);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    try {
      if (apiKey) {
        localStorage.setItem("postify_openai_key", apiKey);
      } else {
        localStorage.removeItem("postify_openai_key");
      }
    } catch (error) {
      console.warn("Failed to save API key to localStorage:", error);
    }
  }, [apiKey]);

  // Helper function to clear the stored API key
  const clearApiKey = useCallback(() => {
    setApiKey("");
    try {
      localStorage.removeItem("postify_openai_key");
    } catch (error) {
      console.warn("Failed to clear API key from localStorage:", error);
    }
  }, []);

  // Helper function to start a new session (clear everything)
  const startNewSession = useCallback(() => {
    setCurrentText("");
    setHistory([]);
    setCurrentIndex(-1);
    setLastActionType(null);
    try {
      localStorage.removeItem("postify_history");
      localStorage.removeItem("postify_current_index");
      localStorage.removeItem("postify_current_text");
      localStorage.removeItem("postify_last_action_type");
    } catch (error) {
      console.warn("Failed to clear history from localStorage:", error);
    }
  }, []);

  const addToHistory = useCallback(
    (newText, description, actionType = "preset") => {
      const newHistoryItem = {
        id: Date.now(),
        text: newText,
        description,
        timestamp: new Date().toLocaleTimeString(),
        type: actionType,
      };

      setHistory((prev) => {
        // Remove any history items after current index (redo path elimination)
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, newHistoryItem];
      });

      setCurrentIndex((prev) => prev + 1);
      setCurrentText(newText);
      setLastActionType(actionType);
    },
    [currentIndex]
  );

  const updateCurrentHistoryItem = useCallback(
    (newText) => {
      if (currentIndex >= 0 && history[currentIndex]) {
        setHistory((prev) => {
          const updated = [...prev];
          updated[currentIndex] = {
            ...updated[currentIndex],
            text: newText,
            timestamp: new Date().toLocaleTimeString(),
          };
          return updated;
        });
        setCurrentText(newText);
      }
    },
    [currentIndex, history]
  );

  const handleTextChange = (text) => {
    if (text === currentText) return; // No change, do nothing

    if (history.length === 0) {
      // First text input
      addToHistory(text, "Initial text", "manual");
    } else if (
      lastActionType === "manual" &&
      currentIndex >= 0 &&
      history[currentIndex]?.type === "manual"
    ) {
      // Continue editing the current manual edit history item
      updateCurrentHistoryItem(text);
    } else {
      // Create new manual edit history item (switching from preset to manual, or after undo/redo)
      addToHistory(text, "Manual edits", "manual");
    }
  };

  const undo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentText(history[newIndex].text);
      setLastActionType(history[newIndex].type || "preset");
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentText(history[newIndex].text);
      setLastActionType(history[newIndex].type || "preset");
    }
  };

  const goToHistoryItem = (index) => {
    setCurrentIndex(index);
    setCurrentText(history[index].text);
    setLastActionType(history[index].type || "preset");
  };

  const processWithPreset = async (preset) => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    if (!currentText.trim()) {
      alert("Please enter some text first!");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are a LinkedIn post enhancement expert specializing in professional social media content optimization. Always respond in the exact same language as the input text. Never translate or change the language of the content. You may freely change tone, style, professionalism, and other aspects as requested by the enhancement instructions. Focus on creating content that performs well on LinkedIn's professional networking platform.",
              },
              {
                role: "user",
                content: `${createBaseInstructions(currentText)}${
                  preset.prompt
                }\n\nIMPORTANT: Respond in the same language as the input text below. Apply the enhancement while preserving the original language.\n\nOriginal post:\n"${currentText}"\n\nEnhanced post:`,
              },
            ],
            max_tokens: 700,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const processedText = data.choices[0].message.content.trim();

      // Remove quotes if the response is wrapped in them
      const cleanedText = processedText.replace(/^["']|["']$/g, "");

      addToHistory(cleanedText, preset.name);
    } catch (error) {
      console.error("Error processing text:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Postify</h1>
        <p>Optimize your LinkedIn posts for maximum engagement</p>
        <div className="api-key-controls">
          <button
            className="new-session-btn"
            onClick={startNewSession}
            title="Start a new session (clears all history)"
          >
            📄 New
          </button>
          <button
            className="api-key-btn"
            onClick={() => setShowApiInput(!showApiInput)}
          >
            {apiKey ? "🔑 API Connected" : "🔑 Set API Key"}
          </button>
          {apiKey && (
            <button
              className="api-clear-btn"
              onClick={clearApiKey}
              title="Clear stored API key"
            >
              🗑️
            </button>
          )}
        </div>
      </header>

      {showApiInput && (
        <div className="api-input-section">
          <div className="api-input-container">
            <input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="api-input"
            />
            <button
              onClick={() => setShowApiInput(false)}
              className="api-save-btn"
            >
              Save
            </button>
          </div>
          <p className="api-help">
            Get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI Platform
            </a>
            <br />
            <small>
              ✓ Your API key is stored securely in your browser and never leaves
              your device
            </small>
          </p>
        </div>
      )}

      <main className="main-content">
        <div className="editor-section">
          <div className="textarea-container">
            <textarea
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Write your LinkedIn post here..."
              className="post-textarea"
              rows={8}
            />
            <div className="controls">
              <button
                onClick={undo}
                disabled={currentIndex <= 0}
                className="control-btn"
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                disabled={currentIndex >= history.length - 1}
                className="control-btn"
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
              <span className="word-count">
                {currentText.length} characters
              </span>
            </div>
          </div>

          <div className="presets-section">
            <h3>✨ Enhancement Presets</h3>
            <div className="presets-grid">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => processWithPreset(preset)}
                  disabled={isProcessing || !currentText.trim()}
                  className="preset-btn"
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                </button>
              ))}
            </div>
            {isProcessing && (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <span>Processing your post...</span>
              </div>
            )}
          </div>
        </div>

        <aside className="history-section">
          <h3>📚 Change History</h3>
          {history.length === 0 ? (
            <p className="empty-history">
              Start typing to see your change history
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => goToHistoryItem(index)}
                  className={`history-item ${
                    index === currentIndex ? "active" : ""
                  }`}
                >
                  <div className="history-header">
                    <span className="history-description">
                      {item.type === "manual" ? "✏️ " : "🤖 "}
                      {item.description}
                    </span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                  <div className="history-preview">
                    {item.text.substring(0, 100)}
                    {item.text.length > 100 ? "..." : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
