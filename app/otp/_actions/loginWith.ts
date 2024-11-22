'use server'

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const loginWithOtp = async (pin: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/auth/login/verify/otp`, {
        method: 'POST',
        body: JSON.stringify({
            "email": "test1@example.com",
            "code": pin,
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.ok) {
        await setAuthCookie(response)

        const dataJson = await response.json();
        return { data: dataJson };
    }

    const errorJson = await response.json();
    return { error: errorJson };
};

const setAuthCookie = async (response: Response) => {
    const cookiesList = await cookies()
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
        const cookiePattern = /([^,]+?Expires=[^;]+;[^,]+|[^,]+)/g;

        // Extraire les cookies
        const cookiesParse = setCookieHeader.match(cookiePattern);
        if (!cookiesParse) return null
        const tokenAccess = cookiesParse[0].split(';')[0].split('=')[1];
        const tokenAccessKey = cookiesParse[0].split(';')[0].split('=')[0];


        const tokenRefresh = cookiesParse[1].split(';')[0].split('=')[1];
        const tokenRefreshKey = cookiesParse[1].split(';')[0].split('=')[0];
        cookiesList.set({
            name: tokenAccessKey,
            value: decodeURIComponent(tokenAccess),
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(jwtDecode(decodeURIComponent(tokenAccess)).exp! * 1000),
        });

        cookiesList.set({
            name: tokenRefreshKey,
            value: decodeURIComponent(tokenRefresh),
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(jwtDecode(decodeURIComponent(tokenRefresh)).exp! * 1000),
        });
    }
};
