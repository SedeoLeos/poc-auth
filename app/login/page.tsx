'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome } from 'lucide-react';

import { redirect } from 'next/navigation'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        await loginWithEmail()

        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }
    async function to(promise) {
        try {
            const result = await promise;
            return [null, result];
        } catch (error) {
            return [error, null];
        }
    }
    const handleOauth = async (event: any) => {
        console.log('*********')
        event.preventDefault();
        window.location.href = `http://localhost:3333/api/v1.0/auth/google`;
    };
    const loginWithEmail = async (email = 'test1@example.com') => {
        const [error, response] = await to(fetch(`http://localhost:3333/api/v1.0/auth/login`, {
            method: 'post', body: JSON.stringify({ email }), headers: {
                "Content-Type": "application/json"
            },
        }))
        console.log(response, error)
        if (response) {
            const data = await response?.json()
            console.log(data.status)
            redirect('otp')
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Connexion</CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour vous connecter
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">


                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                    </div>


                </CardContent>
                <CardFooter>
                    <div className='flex flex-col gap-2 w-full'>


                        <Button className="w-full" onClick={onSubmit}>
                            {isLoading && (
                                <svg
                                    className="mr-2 h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            )}
                            Se connecter
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Ou continuez avec
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleOauth}>
                            <Chrome className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}