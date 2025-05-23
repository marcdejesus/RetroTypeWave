
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
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "code", "function", "loop", "array", "variable", "class", "object", "string",
  "integer", "boolean", "return", "print", "import", "while", "for", "if", "else",
  "elif", "def", "try", "except", "finally", "raise", "assert", "yield", "lambda"
];

export type GameMode = 'no-grammar' | 'grammar' | 'python';

export const GAME_MODES: { id: GameMode; label: string; description: string }[] = [
  { id: 'no-grammar', label: 'Freestyle', description: 'Type a sequence of random common words.' },
  { id: 'grammar', label: 'Prose', description: 'Type excerpts from literature.' },
  { id: 'python', label: 'Python Code', description: 'Type fundamental Python algorithms.' },
];

export const LITERATURE_PROMPTS: readonly string[] = [
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.",
  "The quick brown fox jumps over the lazy dog. This sentence is often used for testing typewriters and computer keyboards because it contains all of the letters of the English alphabet.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
  "All that is gold does not glitter, Not all those who wander are lost; The old that is strong does not wither, Deep roots are not reached by the frost. From the ashes a fire shall be woken, A light from the shadows shall spring;",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
  "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth; Then took the other, as just as fair,",
  "Happy families are all alike; every unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys’ house. The wife had discovered that the husband was carrying on an intrigue with a French governess.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
  "In three words I can sum up everything I've learned about life: it goes on. Live as if you were to die tomorrow. Learn as if you were to live forever."
];

export const PYTHON_ALGORITHM_PROMPTS: readonly string[] = [
  "def factorial(n):\n    # Calculate factorial of n\n    if n < 0:\n        raise ValueError('Factorial is not defined for negative numbers')\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)",
  "def is_prime(num):\n    # Check if a number is prime\n    if num <= 1:\n        return False\n    for i in range(2, int(num**0.5) + 1):\n        if num % i == 0:\n            return False\n    return True",
  "def bubble_sort(arr):\n    # Sort an array using bubble sort algorithm\n    n = len(arr)\n    for i in range(n - 1):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr",
  "def linear_search(arr, target):\n    # Search for target element in arr linearly\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i  # Return index of target if found\n    return -1  # Target not found in the array",
  "def binary_search(arr, target):\n    # Search for target in sorted arr using binary search\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] < target:\n            low = mid + 1\n        elif arr[mid] > target:\n            high = mid - 1\n        else:\n            return mid # Target found\n    return -1 # Target not found",
  "class Node:\n    def __init__(self, data=None):\n        self.data = data\n        self.next_node = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head_node = None\n    # Additional methods like append, display can be added here.",
  "def fibonacci_sequence(n_terms):\n    # Generate Fibonacci sequence up to n_terms\n    if n_terms <= 0:\n        return []\n    elif n_terms == 1:\n        return [0]\n    a, b = 0, 1\n    sequence = [a, b]\n    for _ in range(2, n_terms):\n        next_val = a + b\n        sequence.append(next_val)\n        a, b = b, next_val\n    return sequence",
  "def reverse_string_iterative(s):\n    # Reverse a string using an iterative approach\n    reversed_s = ''\n    for char in s:\n        reversed_s = char + reversed_s\n    return reversed_s",
  "def get_list_sum(numbers_list):\n    # Calculate sum of all numbers in a given list\n    total_sum = 0\n    for number_item in numbers_list:\n        total_sum += number_item\n    return total_sum",
  "# This is a simple Python comment.\n# Python comments are preceded by a hash mark (#).\n# They are ignored by the Python interpreter.\nprint('Hello, Python Developers!') # This line prints a greeting."
];


const DEFAULT_PROMPT_WORD_COUNT = 40; // Reduced for 'no-grammar' mode to be shorter

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateRandomPrompt(mode: GameMode = 'no-grammar', wordCount: number = DEFAULT_PROMPT_WORD_COUNT): string {
  switch (mode) {
    case 'grammar':
      if (LITERATURE_PROMPTS.length === 0) return "Literature prompt pool is empty.";
      return LITERATURE_PROMPTS[Math.floor(Math.random() * LITERATURE_PROMPTS.length)];
    case 'python':
      if (PYTHON_ALGORITHM_PROMPTS.length === 0) return "Python prompt pool is empty.";
      return PYTHON_ALGORITHM_PROMPTS[Math.floor(Math.random() * PYTHON_ALGORITHM_PROMPTS.length)];
    case 'no-grammar':
    default:
      if (WORD_POOL.length === 0) return "Word pool is empty.";
      const wordsToSelect = Math.min(wordCount, WORD_POOL.length);
      const shuffledPool = shuffleArray([...WORD_POOL]);
      return shuffledPool.slice(0, wordsToSelect).join(' ');
  }
}


export const INITIAL_ELO = 1000;
export const ELO_K_FACTOR = 32;
// export const ELO_STORAGE_KEY = 'typeRoyaleUserElo'; // Not used with cookies directly by this name

export const RACE_DURATIONS = [60, 180, 300]; // Durations in seconds (1 min, 3 min, 5 min)

export const BOT_NAMES = ["Speedy Bot", "TypeMaster Flex", "Keyboard Ninja"];
export const AVATAR_PLACEHOLDER_URL = (seed: string, size = 40) => `https://placehold.co/${size}x${size}.png?text=${seed.substring(0,1).toUpperCase()}`;

export const COUNTDOWN_SECONDS = 3;
