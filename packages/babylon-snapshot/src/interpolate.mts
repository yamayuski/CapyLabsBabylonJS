/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @copyright 2022 Masaru Yamagishi
 * @license Apache-2.0
 */

/**
 * linear interpolation
 * @param previous point 1
 * @param current  point 2
 * @param amount   amount(should be from 0 to 1)
 * @returns interpolated value
 */
export function lerp(previous: number, current: number, amount: number): number {
    return previous + (current - previous) * amount;
}

/**
 * one-dimension vector
 */
export type Vector = number;

/**
 * one-dimension vector and recorded time
 */
export type VectorHasTime = [Vector, Time];

export function estimateVector(previous: VectorHasTime, current: VectorHasTime, time: Time): Vector {
    if (current[1] - previous[1] < 0) {
        throw new Error(`current time:${current[0]} must be greater than previous:${previous[0]}`);
    }
    const amount = current[1] - previous[1];
    if (amount > Number.MAX_SAFE_INTEGER) {
        throw new Error(`amount is too big amount=${amount}`);
    }
    const amountNum = Number(amount.toString(10));

    return lerp(previous[0], current[0], amountNum);
}
