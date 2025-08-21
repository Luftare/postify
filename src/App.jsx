import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { PRESETS } from "./data/presets";
import {
  processWithPreset as processWithPresetAPI,
  processWithCustomPrompt as processWithCustomPromptAPI,
} from "./services/apiService";

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
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

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
    (newText, description, actionType = "preset", icon = null) => {
      const newHistoryItem = {
        id: Date.now(),
        text: newText,
        description,
        timestamp: new Date().toLocaleTimeString(),
        type: actionType,
        icon: icon,
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

    setIsProcessing(true);

    try {
      const cleanedText = await processWithPresetAPI({
        apiKey,
        currentText,
        preset,
      });

      addToHistory(cleanedText, preset.name, "preset", preset.icon);
    } catch (error) {
      console.error("Error processing text:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithCustomPrompt = async () => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    setIsProcessing(true);
    setShowCustomPrompt(false);

    try {
      const cleanedText = await processWithCustomPromptAPI({
        apiKey,
        currentText,
        customPrompt,
      });

      addToHistory(cleanedText, "Custom Enhancement", "preset", "🎨");
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
        <div>
          <h1>🦋 Butterfly</h1>
        </div>
        <div className="api-key-controls">
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

      {showCustomPrompt && (
        <div className="custom-prompt-modal">
          <div className="custom-prompt-container">
            <div className="custom-prompt-header">
              <h3>🎨 Custom Enhancement Prompt</h3>
              <button
                onClick={() => setShowCustomPrompt(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom enhancement instructions... (e.g., 'Make it more persuasive and add industry statistics', 'Write in a more technical tone for developers', etc.)"
              className="custom-prompt-textarea"
              rows={4}
            />
            <div className="custom-prompt-actions">
              <button
                onClick={() => setShowCustomPrompt(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={processWithCustomPrompt}
                disabled={!customPrompt.trim() || isProcessing}
                className="apply-btn"
              >
                {isProcessing ? "Processing..." : "Apply Enhancement"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="editor-section">
          <div className="textarea-container">
            <textarea
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="What do you want to talk about?"
              className="post-textarea"
              rows={16}
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

          <div className="history-section">
            <h3>Changes</h3>
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
                        {item.type === "manual"
                          ? "✏️ "
                          : (item.icon || "✨") + " "}
                        {item.description}
                      </span>
                      <span className="history-time">{item.timestamp}</span>
                    </div>
                    <div className="history-preview">{item.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="presets-section">
          <div className="presets-header">
            <h3>Enhancement Tools</h3>
            {isProcessing && (
              <div className="processing-indicator-inline">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          <div className="presets-grid">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => processWithPreset(preset)}
                disabled={isProcessing || !currentText.trim()}
                className="preset-btn"
                title={preset.prompt}
              >
                <span className="preset-icon">{preset.icon}</span>
                <span className="preset-name">{preset.name}</span>
              </button>
            ))}
            <button
              onClick={() => setShowCustomPrompt(true)}
              disabled={isProcessing || !currentText.trim()}
              className="preset-btn custom-preset-btn"
              title="Create your own custom enhancement prompt"
            >
              <span className="preset-icon">🎨</span>
              <span className="preset-name">Custom</span>
            </button>
          </div>
          <div className="actions-section">
            <button
              className="new-session-btn"
              onClick={startNewSession}
              title="Start a new session (clears all history)"
            >
              📄 New
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
