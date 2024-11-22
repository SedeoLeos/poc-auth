'use server'

import { cookies } from "next/headers"
export const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const cookiesList = await cookies()

    return fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
            ...init?.headers, // Merge des headers existants
            Cookie: cookiesList.getAll().map(({ name, value }) => `${name}=${value}`)
                .join('; ') // Ajout des cookies
        },
    });
};
export const getMe = async () => {
    const request = customFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/users/me`, {
        method: 'GET',
        credentials: 'include',
        
    })

    const response = await request
    console.log(response.headers.get("Set-Cookie"))
    const dataJson = await response.json()
    console.log()
    if (response.ok) {
        return { data: dataJson }
    }
    return {
        error: dataJson
    }
}