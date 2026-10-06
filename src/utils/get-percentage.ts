export function getPercentage(userTotal: number, categoryTotal: number): number {
    if (userTotal === 0) {
        return 0;
    }

    return Math.floor((categoryTotal / userTotal) * 100);
}