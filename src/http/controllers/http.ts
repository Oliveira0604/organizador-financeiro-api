export interface HttpRequest {
    body?: unknown
    params?: unknown
    query?: unknown
    headers?: unknown
    cookies?: unknown
    user?: {
        id: string
    }
}

export interface HttpResponse {
    statusCode: number
    body?: unknown
    cookies?: HttpCookie
}

export interface HttpCookie {
    name: string
    value: string
    path: string
    secure: boolean
    sameSite: "lax" | "strict" | "none"
    httpOnly: boolean
}