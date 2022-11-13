/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @copyright 2022 Masaru Yamagishi
 * @license Apache-2.0
 */

/**
 * linear interpolation
 * @param previous point 1
 * @param current  point 2
 * @param amount   amount(0 to 1)
 * @returns interpolated value
 */
export function lerp(previous: number, current: number, amount: number): number {
    return previous + (current - previous) * amount;
}

/**
 * recorded time(with microsecond)
 */
export type Time = bigint;
export type Vector = number;
export type VectorHasTime = [Time, Vector];

export function estimateVectors(previous: VectorHasTime, current: VectorHasTime, time: Time): Vector {
    if (current[0] - previous[0] < 0) {
        throw new Error(`current time:${current[0]} must be greater than previous:${previous[0]}`);
    }
    const amount = current[0] - previous[0];
}
