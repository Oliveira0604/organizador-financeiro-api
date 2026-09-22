export interface HttpRequest {
    body?: unknown
    params?: unknown
    query?: unknown
    headers?: unknown
    user?: {
        id: string
    }
}

export interface HttpResponse {
    statusCode: number
    body?: unknown
}