export function getPercentage(userTotal: number, categoryTotal: number): number {
    if (userTotal === 0) {
        return 0;
    }

    return Number(((categoryTotal / userTotal) * 100).toFixed(2));
}