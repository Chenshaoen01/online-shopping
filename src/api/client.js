const API_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

export const apiUrl = (path) => `${API_URL}${path}`

export const apiFetch = async (path, options = {}) => {
    const { method = 'GET', body, headers, ...rest } = options

    let res
    try {
        res = await fetch(apiUrl(path), {
            ...rest,
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': localStorage.getItem('csrfToken') ?? '',
                ...headers
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        })
    } catch (error) {
        throw new ApiError(0, '網路連線發生問題，請稍後再試')
    }

    const data = await res.json().catch(() => ({}))

    // csrfToken 逾時或不屬於這個帳號，需要重新登入
    if (res.status === 403) {
        localStorage.removeItem('csrfToken')
        window.location.href = '/User/Login'
        throw new ApiError(403, data.message)
    }

    if (!res.ok) {
        throw new ApiError(res.status, data.message)
    }

    return data
}
