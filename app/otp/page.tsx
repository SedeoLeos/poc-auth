'use client'

import { Button } from "@/components/ui/button"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from 'next/navigation'
import { useForm } from "react-hook-form"
import { z } from "zod"
const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})
export default function LoginPage() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "261417",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/auth/login/verify/otp`, {
            method: 'POST', body: JSON.stringify({
                "email": "test1@example.com",
                "code": data.pin,
            }), headers: {
                "Content-Type": "application/json"
            },
        })
        if (response.status < 300) {

            const data = await response.json()
            redirect('/')
        }

    }

    return (
        <div className="flex w-full h-screen justify-center items-center">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 shadow-lg p-10">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your phone.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}