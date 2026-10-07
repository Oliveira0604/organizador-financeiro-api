export type CreateIncomeData = {
    title: string,
    amount: number,
    categoryId: string,
    userId: string,
}

export type UpdateIncomeData = {
    title?: string,
    amount?: number,
    receivedAt?: Date
}

export type Income = {
    id: string,
    title: string,
    amount: number,
    receivedAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date | null,
    deletedAt: Date | null
}

export interface IncomeRepository {
    create(data: CreateIncomeData): Promise<Income>
    findById(id: string): Promise<Income | null>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date, page: number): Promise<Income[]>
    findManyByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date, page: number): Promise<Income[]>
    getTotal(userId: string, startDate: Date, endDate: Date): Promise<number>
    getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>
    getTotalByUserId(userId: string, startDate: Date, endDate: Date): Promise<number>
    update(id: string, data: UpdateIncomeData): Promise<Income | null>
    delete(id: string): Promise<void>
}
