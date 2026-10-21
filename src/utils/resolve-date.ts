export function resolveDate(startDate?: Date, endDate?: Date) {
    const now = new Date();
    const resolvedStartDate = startDate
        ? new Date(startDate.setHours(0, 0, 0, 0))
        : new Date(now.getFullYear(), now.getMonth(), 1);
    const resolvedEndDate = endDate
        ? new Date(endDate.setHours(23, 59, 59, 999))
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return { resolvedStartDate, resolvedEndDate };
}