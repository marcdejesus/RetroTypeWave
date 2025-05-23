
/**
 * @fileOverview Functions for simulating AI opponent typing speed.
 */

/**
 * Generates a random number from a standard normal distribution (mean 0, std dev 1).
 * Uses the Box-Muller transform.
 * @returns {number} A random number from a standard normal distribution.
 */
function getRandomNormalDistribution(): number {
    let u1 = 0, u2 = 0;
    // Convert [0,1) to (0,1)
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0;
}

interface EloTier {
    name: string;
    minElo: number;
    maxElo: number;
    baseWPM: number;
    wpmStandardDeviation: number;
}

/**
 * Simulates an AI opponent's typing speed (WPM) based on the user's Elo rating.
 *
 * @param {number} userElo - The current player's Elo rating.
 * @returns {number} The simulated WPM for the AI opponent.
 */
export function generateAITypingSpeed(userElo: number): number {
    // Define Elo tiers and their WPM characteristics
    const eloTiers: EloTier[] = [
        { name: "Beginner", minElo: 0, maxElo: 999, baseWPM: 35, wpmStandardDeviation: 8 },
        { name: "Novice", minElo: 1000, maxElo: 1200, baseWPM: 50, wpmStandardDeviation: 10 },
        { name: "Intermediate", minElo: 1201, maxElo: 1400, baseWPM: 65, wpmStandardDeviation: 12 },
        { name: "Advanced", minElo: 1401, maxElo: 1600, baseWPM: 80, wpmStandardDeviation: 15 },
        { name: "Expert", minElo: 1601, maxElo: 1800, baseWPM: 95, wpmStandardDeviation: 18 },
        { name: "Master", minElo: 1801, maxElo: Infinity, baseWPM: 110, wpmStandardDeviation: 20 }
    ];

    const MIN_WPM = 10;
    const MAX_WPM = 200;
    const FAIRNESS_BIAS_STRENGTH = 0.75; // How much user's position in tier affects WPM.

    // Ensure userElo is not negative
    const effectiveUserElo = Math.max(0, userElo);

    // Determine the AI's Elo tier based on userElo
    let selectedTier: EloTier = eloTiers[0]; // Default to the first tier
    for (const tier of eloTiers) {
        if (effectiveUserElo >= tier.minElo && effectiveUserElo <= tier.maxElo) {
            selectedTier = tier;
            break;
        }
    }
    // If effectiveUserElo is higher than the last defined tier's minElo, it will correctly use the "Master" tier (due to maxElo: Infinity).

    // --- Fairness Adjustment ---
    let tierMinEffective = selectedTier.minElo;
    let tierMaxEffective = selectedTier.maxElo;

    if (selectedTier.name === "Master") {
        tierMaxEffective = selectedTier.minElo + 400; // Effective max for normalization for the "Master" tier
    }
     if (selectedTier.name === "Beginner" && tierMaxEffective === 999) { // Ensure beginner range has a span if min is 0
        // No change needed here as minElo is 0, maxElo is 999. Range is 999.
     }


    let normalizedEloPositionInTier = 0.5;
    const currentTierRange = tierMaxEffective - tierMinEffective;

    if (currentTierRange > 0) {
        const clampedUserEloForNormalization = Math.max(tierMinEffective, Math.min(effectiveUserElo, tierMaxEffective));
        normalizedEloPositionInTier = (clampedUserEloForNormalization - tierMinEffective) / currentTierRange;
    } else if (effectiveUserElo >= tierMinEffective) { // Handle cases like Master where userElo can exceed tierMaxEffective
        normalizedEloPositionInTier = 1.0; // Consider them at the top or beyond
    } else if (effectiveUserElo < tierMinEffective) {
        normalizedEloPositionInTier = 0.0; // Should not happen if effectiveUserElo is used
    }


    const eloPositionBias = (normalizedEloPositionInTier - 0.5) * FAIRNESS_BIAS_STRENGTH;

    // --- WPM Generation ---
    const randomStandardNormal = getRandomNormalDistribution();
    const biasedRandomStandardNormal = randomStandardNormal + eloPositionBias;
    let generatedWPM = selectedTier.baseWPM + (biasedRandomStandardNormal * selectedTier.wpmStandardDeviation);

    // Clamp the WPM
    generatedWPM = Math.max(MIN_WPM, Math.min(generatedWPM, MAX_WPM));

    return Math.round(generatedWPM);
}
