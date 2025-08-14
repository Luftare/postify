export const postCriteria = [
  {
    aspect: "direct_call_to_action",
    label: "Direct Call to Action",
    description:
      "Ask explicitly for a comment, repost, or follow with a single, clear instruction.",
    signals: [
      "contains any of: comment, let me know, share, repost, follow, tag, DM, 🔔",
    ],
  },
  {
    aspect: "you_centric_addressing",
    label: "You-Centric Addressing",
    description:
      'Write to the reader using "you/your"; make the post about their outcome, not you.',
    signals: ["second_person_ratio > 0.02 (~top quartile)"],
  },
  {
    aspect: "one_focused_question",
    label: "One Focused Question",
    description:
      "Use one clear question to steer replies; avoid piling multiple questions.",
    signals: [
      "exactly one '?' in the post",
      "single What/Which/How at the end",
    ],
  },
  {
    aspect: "social_proof_or_notable_mentions",
    label: "Social Proof or Notable Mentions",
    description:
      "Referencing recognized people/brands/events boosts credibility and curiosity.",
    signals: ["mentions a well-known name/brand relevant to the audience"],
  },
  {
    aspect: "enumerated_points",
    label: "Enumerated Points",
    description:
      "Use a numbered/bulleted mini-list to make ideas scannable; tends to raise likes/overall engagement.",
    signals: ["patterns like '1.' / '2)' / '—' prefixed items"],
  },
  {
    aspect: "moderate_emojis",
    label: "Moderate Emojis",
    description:
      "A few emojis add tone without hurting clarity; too many backfires.",
    signals: ["2–3 emojis total; avoid 0 and avoid 4+ in body"],
  },
  {
    aspect: "audience_dominant_language",
    label: "Audience Dominant Language",
    description:
      "Write in the language your target audience uses most; broader lingua francas reach farther.",
    signals: [
      "language matches audience; avoid niche language for global reach",
    ],
  },
];
