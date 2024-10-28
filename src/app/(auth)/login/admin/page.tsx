"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"

const AdminSchema = z.object({
    email: z.string().email('Missing email'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default function AdminLogin() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof AdminSchema>>({
        mode: 'onChange',
        resolver: zodResolver(AdminSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof AdminSchema>) => {
        setIsLoading(true);
        const res = await signIn("admin", {
            email: values.email,
            password: values.password,
        });
        if (!res?.error) {
            window.location.href = "/hostel/admin";
        }
        if (res?.error) {
            form.setError("password", { message: "Invalid email or password" });
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form
                className="flex md:w-[30%] w-4/5 mx-auto mt-[20vh] flex-col gap-y-6 border-1 py-8 md:px-12 px-16 rounded-lg shadow-lg"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl font-semibold flex items-center">
                        SBP Bhawan
                        <span className="text-blue-500 text-sm ml-2">
                         (Admin Login)
                        </span>
                    </h1>
                    <p className="text-gray-500">Login to your account</p>
                </div>
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password*</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={isVisible ? "text" : "password"} placeholder="Enter your password" {...field} />
                                    <span onClick={() => { setIsVisible(!isVisible) }} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                                        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit">Login</Button>
            </form>
        </Form>
    )
}
