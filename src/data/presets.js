export const PRESETS = [
  {
    id: "hook",
    name: "Add Hook",
    icon: "🎯",
    prompt:
      "It's the first line you write to grab readers' attention, awaken their curiosity, and motivate them to click “See more.” This can be: Short dialogues, intriguing questions, weird words, statistics, inspirational quotes, surprising (or extraordinary) insights related to your niche, unusual or little-known facts, or how-to offerings. Make a headline intriguing yet communicating some benefits a user will get after reading it. Avoid long blocks of text. Make your hook easy to scan for users scrolling their LinkedIn newsfeeds.",
  },
  {
    id: "storytelling",
    name: "Add Storytelling",
    icon: "📖",
    prompt:
      "Transform into a compelling story that engages readers emotionally and creates a narrative arc.",
  },
  {
    id: "split",
    name: "Split into Sections",
    icon: "🪓",
    prompt:
      "Add rhythm to the text by splitting it into short sections separated by empty lines so that readers can scan content.",
  },
  {
    id: "simplify",
    name: "Simplify Language",
    icon: "🍼",
    prompt:
      "Rewrite the text so a 10-year-old can understand it. Keep the same overall structure, but use simpler words and break up long sentences into shorter ones.",
  },
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
    icon: "🤩",
    prompt: "Add appropriate emojis to make the content more engaging.",
  },
  {
    id: "list",
    name: "Add Lists",
    icon: "🗂️",
    prompt: "Create structure with one or more lists.",
  },
  {
    id: "engagement",
    name: "Boost Engagement",
    icon: "🚀",
    prompt:
      "Improve to maximize engagement by making it more compelling, actionable, and conversation-starting.",
  },
  {
    id: "provocate",
    name: "Make Provocative",
    icon: "⚡",
    prompt:
      "Provocate readers to engage with falsy or bold statement that people have a strong opinion about.",
  },
  {
    id: "creativity",
    name: "Reimagine Post",
    icon: "🌀",
    prompt:
      "Rewrite the text completely with a different angle. Keep the essence but put it in a whole new package that looks very different in all possible ways. Think outside the box. Be 1000x more creative.",
  },
  {
    id: "shorten",
    name: "Shorten Post",
    icon: "📏",
    prompt:
      "Shorten the text by 50% while maintaining the key content and tone of voice.",
  },
  {
    id: "cut_fluff",
    name: "Cut the Fluff",
    icon: "🧹",
    prompt:
      "Cut out fluff such as: filler words, fancy words, and repetitions. Show your audience that you value their time.",
  },
  {
    id: "activate",
    name: "Activate Voice",
    icon: "🔊",
    prompt:
      "Replace passive voice and weak adverbs. The more active verbs (with a person in the subject position) in the text, the better.",
  },
  {
    id: "sensory",
    name: "Add Sensory Details",
    icon: "🌈",
    prompt:
      "Add sensory details such as: Power words, persuasive and descriptive language, beneficial adjectives, sensory words appealing to the five senses, and humor where appropriate.",
  },
  {
    id: "relatable",
    name: "Make Relatable",
    icon: "🤝",
    prompt:
      "Rewrite the text in a way that makes readers see themselves in it. Use everyday situations, analogies, or challenges professionals often face.",
  },
  {
    id: "curiosity",
    name: "Build Curiosity",
    icon: "🕵️‍♂️",
    prompt:
      "Tweak the post to leave open loops, ask thought-provoking questions, or tease insights that make people want to read until the end.",
  },
  {
    id: "polarize",
    name: "Add Polarization",
    icon: "⚔️",
    prompt:
      "Sharpen the post with a strong, opinionated stance. Draw a clear line in the sand that makes people either agree or disagree passionately.",
  },
  {
    id: "question",
    name: "Ask a Question",
    icon: "❓",
    prompt:
      "Transform into a short, curiosity-sparking question post. Lead with a single clear question your audience can’t resist answering. Keep it direct, conversational, and easy to respond to.",
  },
  {
    id: "thought_leadership",
    name: "Share a Bold Opinion",
    icon: "🔥",
    prompt:
      "Transform into a thought-leadership post that challenges conventional wisdom. Open with a strong statement, back it up with your reasoning or experience, and close by inviting others’ perspectives.",
  },
  {
    id: "listicle",
    name: "Create a Mini List",
    icon: "📝",
    prompt:
      "Transform into a punchy list of 3–10 items. Each point should be easy to scan, offer immediate value, and feel like a quick resource people will want to save and share.",
  },
  {
    id: "short_one_liner",
    name: "Drop a One-Liner",
    icon: "💥",
    prompt:
      "Transform into a short, striking one-liner post. Keep it under 2 sentences. Make it witty, insightful, or contrarian—something that hooks instantly while scrolling.",
  },
  {
    id: "long_form",
    name: "Write Long-Form",
    icon: "📜",
    prompt:
      "Transform into a long-form text post with a clear structure. Use short paragraphs, strong section breaks, and a narrative flow that rewards readers who keep scrolling.",
  },
  {
    id: "results",
    name: "Share Results",
    icon: "📊",
    prompt:
      "Transform into a results breakdown. Share specific numbers, strategies, or outcomes. Explain what was done, what worked, and the key takeaway for others.",
  },
  {
    id: "announcement",
    name: "Make an Announcement",
    icon: "📣",
    prompt:
      "Transform into a big announcement. Frame the update as exciting news, express gratitude, and invite others to celebrate or engage.",
  },
  {
    id: "life_update",
    name: "Post a Life Update",
    icon: "🌱",
    prompt:
      "Transform into an authentic, personal update. Share a real story about change, challenge, or growth, written in a relatable and genuine tone.",
  },
  {
    id: "humor",
    name: "Add Humor",
    icon: "🤣",
    prompt:
      "Transform into a humorous, light-hearted post. Use wit, irony, or a playful observation that your professional audience will relate to.",
  },
  {
    id: "event_recap",
    name: "Do an Event Recap",
    icon: "🎟️",
    prompt:
      "Transform into a recap of an event, talk, or workshop. Share the most valuable insights, lessons, or memorable moments, and highlight your key takeaways.",
  },
  {
    id: "celebrate",
    name: "Celebrate a Win",
    icon: "🥳",
    prompt:
      "Transform into a celebratory post about a milestone or achievement. Share the story behind it, give credit where due, and show gratitude to those involved.",
  },
  {
    id: "research",
    name: "Share Research",
    icon: "🔬",
    prompt:
      "Transform into an insight-driven post. Highlight data, research findings, or survey results, explain their meaning, and invite discussion around the implications.",
  },
];
