
// export const PROMPT_TEXT = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zephyrs jump! A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent. The job requires extra pluck and zeal from every young wage earner. Sphinx of black quartz, judge my vow.";

export const WORD_POOL: readonly string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  // TODO: Expand this list to ~500 words for more variety
];

const DEFAULT_PROMPT_WORD_COUNT = 60;

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateRandomPrompt(wordCount: number = DEFAULT_PROMPT_WORD_COUNT): string {
  if (WORD_POOL.length === 0) return "Word pool is empty. Please add words to WORD_POOL in constants.ts.";
  // Ensure we don't try to pick more words than available in the pool, or select a representative subset
  const wordsToSelect = Math.min(wordCount, WORD_POOL.length);
  const shuffledPool = shuffleArray([...WORD_POOL]); // Shuffle a copy of the pool
  
  // Take the first `wordsToSelect` words from the shuffled pool
  const selectedWords = shuffledPool.slice(0, wordsToSelect);
  
  return selectedWords.join(' ');
}


export const INITIAL_ELO = 1000;
export const ELO_K_FACTOR = 32;
export const ELO_STORAGE_KEY = 'typeRoyaleUserElo';

export const RACE_DURATIONS = [60, 180, 300]; // Durations in seconds (1 min, 3 min, 5 min)

export const BOT_NAMES = ["Speedy Bot", "TypeMaster Flex", "Keyboard Ninja"];
export const AVATAR_PLACEHOLDER_URL = (seed: string, size = 40) => `https://placehold.co/${size}x${size}.png?text=${seed.substring(0,1).toUpperCase()}`;

export const COUNTDOWN_SECONDS = 3;

