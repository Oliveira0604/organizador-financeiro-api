export type CreateExpenseData = {
    title: string,
    amount: number,
    categoryId: string,
    userId: string,
}

export type UpdateExpenseData = {
    title?: string,
    amount?: number,
    categoryId?: string
}

export type Expense = {
    id: string
    title: string,
    amount: number,
    paidAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date | null
    deletedAt: Date | null
}

export interface ExpenseRepository {
    create(data: CreateExpenseData): Promise<Expense>
    findById(id: string): Promise<Expense | null>
    findManyByCategoryId(categoryId: string, startDate: Date, endDate: Date, page: number): Promise<Expense[]>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date, page: number): Promise<Expense[]>
    getTotal(userId: string, startDate: Date, endDate: Date): Promise<number>
    getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<number>
    getTotalByUserId(userId: string, startDate: Date, endDate: Date): Promise<number>
    update(id: string, data: UpdateExpenseData): Promise<Expense | null>
    delete(id: string): Promise<void>
}
