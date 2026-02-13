import { LevelData } from '../types';

// Placeholder audio - using royalty free calm music URLs
// In a real app, these would be local files like '/music/rose_theme.mp3'
const AUDIO_BASE = "https://cdn.pixabay.com/download/audio";

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "The First Rose I Never Gave You",
    unlockDate: "2026-02-07T00:00:00+05:30", // IST
    theme: "rose",
    bgGradient: "bg-gradient-to-b from-pink-900 via-rose-800 to-black",
    icon: "🌹",
    paragraph: "I didn’t know when it started… only that you stayed. If feelings had a color, mine would bloom like this rose. A quiet beginning to something beautiful.",
    loveNotes: [
      "Somewhere between random moments… you quietly became my favorite one.",
      "If feelings had petals, mine would bloom only when you smile.",
      "I never planned to like you this much… but here we are.",
      "This rose is not red… it’s the color of every thought that leads to you."
    ],
    minigameType: "bloomRose",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3" // Soft Piano
  },
  {
    id: 2,
    name: "The Question My Heart Asked First",
    unlockDate: "2026-02-08T00:00:00+05:30",
    theme: "gold",
    bgGradient: "bg-gradient-to-b from-yellow-900 via-amber-800 to-black",
    icon: "💍",
    paragraph: "Before words, my heart already chose you. If love was a question… you were always my answer. A quiet confession in the golden light.",
    loveNotes: [
      "Before I ever said anything… my heart had already chosen you.",
      "If love is a question, then you are every answer I want.",
      "I don’t promise perfection… only a heart that stays.",
      "If I hold your hand, I think even silence would feel complete."
    ],
    minigameType: "steadyHeart",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" // Hopeful
  },
  {
    id: 3,
    name: "Little Sweet Things That Remind Me Of You",
    unlockDate: "2026-02-09T00:00:00+05:30",
    theme: "chocolate",
    bgGradient: "bg-gradient-to-b from-amber-950 via-orange-900 to-black",
    icon: "🍫",
    paragraph: "You made ordinary days taste sweet. Even silence feels warm with you. Like a favorite song or a warm cocoa, you are my comfort.",
    loveNotes: [
      "You make ordinary days feel softly magical.",
      "Even quiet moments feel sweet when you are in them.",
      "If happiness had a taste… it would feel like talking to you.",
      "You didn’t add sweetness to my life… you became it."
    ],
    minigameType: "memoryJar",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-hazy-afternoon-4.mp3" // Cozy
  },
  {
    id: 4,
    name: "If You Ever Feel Alone, Hold My Heart",
    unlockDate: "2026-02-10T00:00:00+05:30",
    theme: "teddy",
    bgGradient: "bg-gradient-to-b from-pink-950 via-fuchsia-900 to-black",
    icon: "🧸",
    paragraph: "If I could, I’d be there beside you… quietly. You never have to feel alone. I am your soft place to land, your warm hug in the distance.",
    loveNotes: [
      "If the world ever feels heavy… come rest in my heart.",
      "You never have to be strong alone.",
      "Some loves don’t shout… they quietly protect.",
      "If I could, I would sit beside you… even in silence."
    ],
    minigameType: "protectHeart",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3" // Lullaby-ish
  },
  {
    id: 5,
    name: "The Forever I Whisper To You",
    unlockDate: "2026-02-11T00:00:00+05:30",
    theme: "promise",
    bgGradient: "bg-gradient-to-b from-indigo-950 via-slate-800 to-black",
    icon: "🤝",
    paragraph: "I promise the small things. Even on silent days… I’ll still choose you. An invisible thread ties my forever to yours.",
    loveNotes: [
      "I promise the little things… the ones that matter most.",
      "Even on silent days… I will still choose you.",
      "Not perfect, not always strong… but always yours.",
      "Forever isn’t a word… it’s a decision I make for you every day."
    ],
    minigameType: "connectHearts",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3" // Cinematic
  },
  {
    id: 6,
    name: "Where The World Becomes Quiet",
    unlockDate: "2026-02-12T00:00:00+05:30",
    theme: "hug",
    bgGradient: "bg-gradient-to-b from-rose-950 via-red-900 to-black",
    icon: "🤗",
    paragraph: "Some hugs speak louder than words. With you… everything feels calm. In the safety of your arms, the noise of the world fades away.",
    loveNotes: [
      "Some hugs feel like home… you are one of them.",
      "With you, everything feels a little softer.",
      "If hearts could speak… mine would whisper your name.",
      "In your presence, the world feels quieter… safer."
    ],
    minigameType: "hugRhythm",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3" // Uplifting
  },
  {
    id: 7,
    name: "Intimate, Gentle, Eternal Love",
    unlockDate: "2026-02-13T00:00:00+05:30",
    theme: "kiss",
    bgGradient: "bg-gradient-to-b from-red-950 via-pink-900 to-black",
    icon: "💋",
    paragraph: "A kiss is a secret told to the mouth instead of the ear. It’s the moment where the world stops spinning, and the only thing that exists is us. Gentle, quiet, and forever imprinted on my soul.",
    loveNotes: [
      "Some moments don’t need words… only closeness.",
      "If love had a heartbeat… it would sound like us.",
      "You are not just part of my story… you are the feeling of it.",
      "Not just today, not just now… always you."
    ],
    minigameType: "catchKisses",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-romantic-jazz-moment-63.mp3" // Romantic
  },
  {
    id: 8,
    name: "The Final Mystery — Forever",
    unlockDate: "2026-02-14T00:00:00+05:30",
    theme: "valentine",
    bgGradient: "bg-gradient-to-b from-gray-900 to-black",
    icon: "💖",
    paragraph: "The final mystery awaits. Solve the riddles of our heart to reveal the ending.",
    loveNotes: [
      "Written in stars.",
      "Eternally ours.",
      "The best ending.",
      "Just the start."
    ],
    minigameType: "mysteryUnlock",
    audioSrc: "https://assets.mixkit.co/music/preview/mixkit-slow-trail-71.mp3" // Emotional Finale
  }
];