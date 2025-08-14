# 📝 Postify

A LinkedIn post optimization tool that helps enhance your posts for maximum engagement using AI-powered presets.

![Postify Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Postify+LinkedIn+Post+Optimizer)

## ✨ Features

- **AI-Powered Enhancement**: Uses OpenAI's GPT-3.5-turbo to improve your LinkedIn posts
- **Multiple Presets**: Choose from various enhancement options:
  - ✏️ Fix Grammar
  - 😊 Add Emojis
  - 💡 100% Clarity
  - 🚀 Boost Engagement
  - 👔 More Professional
  - 📖 Add Storytelling
- **Undo/Redo System**: Full version control with branching history
- **Change History**: Visual timeline of all your edits with timestamps
- **Elegant UI**: Modern, responsive design with glassmorphism effects
- **Real-time Preview**: See character count and live text updates

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd postify
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Setting up OpenAI API

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. In the app, click "🔑 Set API Key"
4. Paste your API key and save

**Important**: Your API key is stored locally in your browser and never sent to any server except OpenAI's API.

## 🎯 How to Use

1. **Write Your Post**: Start by typing your LinkedIn post in the text area
2. **Choose Enhancement**: Select from the available presets to improve your post
3. **Review Results**: The AI will process your text and show the enhanced version
4. **Iterate**: Use different presets or make manual edits
5. **Navigate History**: Use undo/redo or click on history items to jump between versions
6. **Copy & Share**: Copy your final optimized post to LinkedIn

## 🏗️ Architecture

- **Frontend**: React 19 with Vite
- **Styling**: Custom CSS with modern design patterns
- **State Management**: React hooks with custom history tracking
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **Build Tool**: Vite for fast development and optimized builds

## 📁 Project Structure

```
postify/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global base styles
├── public/              # Static assets
├── package.json         # Project dependencies
└── README.md           # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Key Features Explained

### Undo/Redo System

The app implements a sophisticated version control system:

- Each change creates a new history item
- Undo/redo buttons navigate through the timeline
- Branching: Making changes after undoing eliminates the "redo" path
- Click any history item to jump to that version instantly

### AI Presets

Each preset uses carefully crafted prompts to optimize posts for different goals:

- **Grammar**: Fixes errors while preserving tone
- **Emojis**: Adds professional yet engaging emojis
- **Clarity**: Rewrites for maximum readability
- **Engagement**: Makes posts more compelling and actionable
- **Professional**: Elevates tone while maintaining authenticity
- **Storytelling**: Transforms posts into engaging narratives

### Responsive Design

- Desktop: Two-column layout with editor and history sidebar
- Tablet: Single column with collapsible history
- Mobile: Optimized touch experience with stacked components

## 🔒 Privacy & Security

- **API Key**: Stored locally in your browser, never on our servers
- **Posts**: Your content is only sent to OpenAI for processing
- **No Data Collection**: We don't store or track your posts
- **Open Source**: Full transparency with source code available

## 🛠️ Development

### Adding New Presets

To add a new preset, modify the `PRESETS` array in `src/App.jsx`:

```javascript
{
  id: 'your-preset-id',
  name: 'Your Preset Name',
  icon: '🎯',
  prompt: 'Your custom prompt for OpenAI...'
}
```

### Customizing Styles

The app uses CSS custom properties for easy theming. Key variables are defined in `src/App.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-blur: blur(10px);
  --border-radius: 20px;
}
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- React team for the excellent framework
- Vite for the lightning-fast build tool

---

**Made with ❤️ for LinkedIn creators who want to maximize their engagement**
