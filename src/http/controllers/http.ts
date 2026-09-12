export interface HttpRequest {
    body?: unknown,
    params?: unknown,
    query?: unknown,
    headers?: unknown
}

export interface HttpResponse {
    statusCode: number,
    body?: unknown
}