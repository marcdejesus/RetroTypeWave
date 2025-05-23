
export const PROMPT_TEXT = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zephyrs jump! A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent. The job requires extra pluck and zeal from every young wage earner. Sphinx of black quartz, judge my vow.";

export const INITIAL_ELO = 1000;
export const ELO_K_FACTOR = 32;
export const ELO_STORAGE_KEY = 'typeRoyaleUserElo';

export const RACE_DURATIONS = [30, 60, 90]; // in seconds

export const BOT_NAMES = ["Speedy Bot", "TypeMaster Flex", "Keyboard Ninja"];
export const AVATAR_PLACEHOLDER_URL = (seed: string, size = 40) => `https://placehold.co/${size}x${size}.png?text=${seed.substring(0,1).toUpperCase()}`;

export const COUNTDOWN_SECONDS = 3;
