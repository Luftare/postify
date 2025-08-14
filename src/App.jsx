import { useState, useCallback } from "react";
import "./App.css";

const PRESETS = [
  {
    id: "grammar",
    name: "Fix Grammar",
    icon: "✏️",
    prompt:
      "Fix any grammar, spelling, and punctuation errors in this LinkedIn post while keeping the original tone and meaning intact:",
  },
  {
    id: "emojis",
    name: "Add Emojis",
    icon: "😊",
    prompt:
      "Add appropriate emojis to this LinkedIn post to make it more engaging while maintaining professionalism:",
  },
  {
    id: "clarity",
    name: "100% Clarity",
    icon: "💡",
    prompt:
      "Rewrite this LinkedIn post for maximum clarity and readability while preserving the core message:",
  },
  {
    id: "engagement",
    name: "Boost Engagement",
    icon: "🚀",
    prompt:
      "Rewrite this LinkedIn post to maximize engagement by making it more compelling and actionable:",
  },
  {
    id: "professional",
    name: "More Professional",
    icon: "👔",
    prompt:
      "Rewrite this LinkedIn post to sound more professional and polished while keeping it authentic:",
  },
  {
    id: "storytelling",
    name: "Add Storytelling",
    icon: "📖",
    prompt:
      "Transform this LinkedIn post into a compelling story that engages readers emotionally:",
  },
];

function App() {
  const [currentText, setCurrentText] = useState("");
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [lastActionType, setLastActionType] = useState(null); // 'manual' | 'preset' | null

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
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `${preset.prompt}\n\n"${currentText}"`,
              },
            ],
            max_tokens: 500,
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
        <button
          className="api-key-btn"
          onClick={() => setShowApiInput(!showApiInput)}
        >
          {apiKey ? "🔑 API Connected" : "🔑 Set API Key"}
        </button>
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
