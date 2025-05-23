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

export type GameMode = 'no-grammar' | 'grammar' | 'story';

export const GAME_MODES: { id: GameMode; label: string; description: string }[] = [
  { 
    id: 'no-grammar', 
    label: 'Freestyle', 
    description: 'Type random common words to build raw typing speed.' 
  },
  { 
    id: 'grammar', 
    label: 'Grammar', 
    description: 'Practice with proper punctuation and capitalization.' 
  },
  { 
    id: 'story', 
    label: 'Story', 
    description: 'Type engaging Reddit stories.' 
  },
];

export const LITERATURE_PROMPTS: readonly string[] = [
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.",
  "The quick brown fox jumps over the lazy dog. This sentence is often used for testing typewriters and computer keyboards because it contains all of the letters of the English alphabet.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
  "All that is gold does not glitter, Not all those who wander are lost; The old that is strong does not wither, Deep roots are not reached by the frost. From the ashes a fire shall be woken, A light from the shadows shall spring;",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
  "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth; Then took the other, as just as fair,",
  "Happy families are all alike; every unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue with a French governess.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
  "In three words I can sum up everything I've learned about life: it goes on. Live as if you were to die tomorrow. Learn as if you were to live forever."
];

export const REDDIT_STORIES: readonly string[] = [
  "The Tortoise and the Hare is one of Aesop's most famous fables. One day, a boastful hare was making fun of a slow-moving tortoise. Tired of the hare's arrogant behavior, the tortoise challenged him to a race. The hare, amused by the tortoise's confidence, quickly agreed, knowing he could easily outrun his slow competitor.\n\nAs the race began, the hare quickly left the tortoise behind. Seeing how far ahead he was, the hare decided to take a nap, confident that he could still win even after a short rest. The tortoise, meanwhile, kept moving forward slowly but steadily, never stopping to rest or becoming distracted from his goal.\n\nWhile the hare slept, the tortoise passed him and continued his journey toward the finish line. When the hare finally woke up, he ran as fast as he could, but it was too late. The tortoise had already crossed the finish line and won the race. This story teaches us that slow and steady progress can overcome natural talent when combined with overconfidence and poor choices.",

  "The Boy Who Cried Wolf tells the story of a young shepherd boy who repeatedly tricked the nearby villagers by crying out 'Wolf!' when there was no wolf in sight. Each time the villagers heard his cries, they would run up the hill to help him drive the wolf away, only to find the boy laughing at their concern. The boy found great amusement in watching the villagers run up the hill for nothing.\n\nAfter several false alarms, the villagers became skeptical of the boy's cries. They had grown tired of being fooled and decided that they would no longer respond to his calls for help. The boy continued his pranks, not realizing the dangerous position he was putting himself in by destroying the villagers' trust.\n\nOne day, a real wolf appeared and began threatening the boy's flock. The terrified boy cried out 'Wolf! Wolf!' louder than ever before. But this time, the villagers, believing it to be another prank, did not come to help. The wolf was able to feast on the flock as it pleased. The boy learned a hard lesson that day about the importance of honesty and not betraying others' trust.",

  "The Three Little Pigs is a story about three pig brothers who set out to build their own homes. The first little pig, wanting to finish quickly, built his house out of straw. The second pig, equally hasty, constructed his house from sticks. However, the third little pig took his time and carefully built his house using sturdy bricks, despite his brothers teasing him for working so hard.\n\nOne day, a big bad wolf came to the first pig's straw house. He huffed and puffed and blew the house down easily, forcing the first pig to run to his brother's stick house for safety. The wolf followed and again huffed and puffed, destroying the stick house as well. Both pigs then fled to their brother's brick house, the only remaining safe haven.\n\nWhen the wolf arrived at the brick house, he huffed and puffed with all his might, but the house stood strong. No matter how hard he tried, he couldn't blow down the well-built brick house. Eventually, he gave up and left, never to return. The three little pigs learned that hard work and careful planning are more valuable than quick and easy solutions.",

  "The Lion and the Mouse tells a story of an unlikely friendship between the king of the jungle and a tiny mouse. One day, a mighty lion was sleeping peacefully when a small mouse accidentally ran across his face. The lion woke up angry and caught the mouse between his paws, ready to eat him. The terrified mouse begged for mercy, promising to help the lion someday if he let him go. The lion found this amusing, as he couldn't imagine how such a tiny creature could ever help him.\n\nSome time later, the lion was hunting in the forest when he became caught in a hunter's net. He struggled to break free but became more entangled with each movement. His mighty roars of frustration echoed through the forest. The same little mouse he had spared heard these roars and quickly came to investigate. Seeing the lion's predicament, the mouse remembered his promise.\n\nWithout hesitation, the mouse began gnawing through the ropes of the net. His small size and sharp teeth were perfect for the task, and soon he had created a hole large enough for the lion to escape. The lion was humbled and grateful, learning that even the smallest of creatures can be valuable allies. From that day forward, the lion and mouse remained friends, proving that kindness and mercy can bring unexpected rewards.",

  "The Golden Goose follows the story of a kind-hearted young man named Hans who helped an old man in the forest. The elderly man, who was actually a magical being in disguise, rewarded Hans with a special goose that laid golden eggs. Hans was overjoyed with his gift and decided to take the goose to the market. As he walked, he noticed that anyone who touched the goose became stuck to it, unable to let go.\n\nAlong his journey, several greedy villagers attempted to steal a golden feather from the goose. First came a nosy innkeeper's daughter, then her sister, followed by the village priest, and even the local baker. Each person who touched either the goose or someone already stuck became part of an increasingly long and amusing parade following Hans through the village. The townspeople couldn't help but laugh at the sight of this strange procession.\n\nFinally, Hans arrived at the castle, where the king's daughter, who had never laughed in her life, saw the comical parade of stuck villagers. For the first time ever, she burst into laughter at the silly sight. The king was so delighted to hear his daughter laugh that he granted Hans her hand in marriage. Hans's kindness to the old man had led him to not only wealth through the golden goose but also to love and happiness.",

  "The Magic Pot tells of an old woman who lived alone in a small village. One snowy evening, she found a mysterious pot outside her door. Thinking someone had left it as a gift, she brought it inside. To her amazement, when she placed the pot on her table and said she wished for some soup, the pot immediately filled with delicious, hot soup. She discovered that the pot would produce any food she requested, solving her struggles with hunger.\n\nWord of the magical pot spread through the village, and soon her greedy neighbor decided to steal it. One night, while the old woman slept, the neighbor crept into her house and took the pot. However, when she tried to use it at home, she didn't know the right words to say. In her frustration, she shouted angrily at the pot, causing it to overflow with boiling soup that wouldn't stop pouring out.\n\nThe neighbor's house began to fill with soup, forcing her to run to the old woman for help. The old woman, being kind-hearted, helped stop the pot and forgave her neighbor. From that day forward, the old woman shared her pot's bounty with the entire village, and her formerly greedy neighbor learned the value of generosity and community.",

  "The Wise King tells of a ruler who wanted to test the wisdom of his three daughters. He gathered them together and announced that he would give his kingdom to the one who loved him most. The eldest daughter compared her love to gold, saying it was precious and valuable. The second daughter likened her love to the rarest jewels, claiming it was beautiful and priceless. The youngest daughter, however, simply said she loved him as much as salt.\n\nThe king, offended by his youngest daughter's comparison of his worth to something as common as salt, banished her from the kingdom. She left with nothing but the clothes on her back and found work in a neighboring kingdom's kitchen. Years passed, and one day, the king was invited to a grand feast in that kingdom, not knowing his daughter had prepared it. She instructed the cooks to prepare all the dishes without any salt.\n\nWhen the king tasted the bland food, he realized how essential salt was to life, just as his daughter's love had been pure and essential to him. He understood the wisdom in her words - that love, like salt, is a basic necessity that makes life worth living. The king sought out his daughter, begged her forgiveness, and realized she had been the wisest of all. He named her his successor, knowing she would rule with both wisdom and humility.",

  "The Magical Garden is a tale about two young sisters who inherited a mysterious garden from their grandmother. The garden was said to grant wishes, but only to those who truly cared for it. The older sister wished for instant beauty and demanded the garden produce magnificent flowers immediately. When nothing happened, she grew frustrated and abandoned her portion of the garden, letting it become overrun with weeds.\n\nThe younger sister took a different approach. She spent time learning about each plant, carefully tending to the soil, and patiently watering her section every day. She talked to the plants and enjoyed watching them grow naturally. Though progress was slow, she found joy in the small daily changes and the occasional butterfly or bird that visited her growing garden.\n\nAs months passed, the younger sister's patience and dedication were rewarded. Her section of the garden bloomed into a paradise of colorful flowers, fragrant herbs, and fruit-bearing trees. The garden had granted her wish, not through magic, but through her own dedication and love. The older sister learned that true magic often comes through patience, care, and genuine effort rather than demanding immediate results.",

  "The Bridge of Truth tells of a magical bridge that would only let honest travelers cross. Those who tried to cross while telling lies would find the bridge disappear beneath their feet, dropping them into the shallow stream below. One day, three merchants approached the bridge, each carrying valuable goods to sell at the market. The first merchant confidently stepped onto the bridge, declaring all his goods were authentic, only to find himself splashing into the water.\n\nThe second merchant, seeing this, decided to be partially honest. He admitted some of his goods were fake but claimed the rest were genuine. As he stepped onto the bridge, it remained solid for a few steps before vanishing, sending him too into the stream. The third merchant watched carefully and made a decision. When it was his turn, he honestly admitted that while his goods were not the finest, they were fairly priced and would serve their purpose well.\n\nTo everyone's amazement, the third merchant crossed the bridge safely. Word of his honesty spread through the market, and soon he became known as the most trusted merchant in the land. His business flourished not because he had the best goods, but because people knew they could trust his word. The bridge had taught all three merchants that honesty, even when difficult, is always the best path.",

  "The Singing Tree is a story about a young girl named Maya who discovered a tree that sang beautiful melodies when the wind blew through its leaves. The tree grew in the center of her village and had been silent for generations, but Maya noticed that it responded to kindness. She began spending time with the tree, sharing her thoughts and treating it with care, while others in the village ignored it.\n\nOne day, during a terrible drought, the village well ran dry. The adults were frantically trying to find water when Maya remembered how the tree's leaves would turn toward underground springs. She convinced the village elders to dig where the tree's longest branch pointed. Though skeptical, they agreed to try, and to everyone's amazement, they discovered a fresh water source that saved the village.\n\nFrom that day forward, the tree began to sing more often, its melodies bringing joy to the entire village. The villagers finally understood that Maya's kindness and attention had awakened the tree's magic. They learned that sometimes the most ordinary things can become extraordinary when treated with love and respect. The tree's songs became famous throughout the land, but it sang most beautifully when Maya sat beneath its branches, reminding everyone that magic often appears to those who believe in it."
];

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DEFAULT_PROMPT_WORD_COUNT = 40; // Reduced for 'no-grammar' mode to be shorter

export function generateRandomPrompt(mode: GameMode = 'no-grammar', wordCount: number = DEFAULT_PROMPT_WORD_COUNT): string {
  switch (mode) {
    case 'grammar':
      if (LITERATURE_PROMPTS.length === 0) return "Literature prompt pool is empty.";
      return LITERATURE_PROMPTS[Math.floor(Math.random() * LITERATURE_PROMPTS.length)];
    case 'story':
      if (REDDIT_STORIES.length === 0) return "Story pool is empty.";
      return REDDIT_STORIES[Math.floor(Math.random() * REDDIT_STORIES.length)];
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
