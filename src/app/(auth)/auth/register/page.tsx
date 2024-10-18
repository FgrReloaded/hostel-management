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
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { createUser } from "@/actions/student/student"
import { signIn } from "next-auth/react"


const CustomerSchema = z.object({
    name: z.string().min(2, 'Name is mandatory'),
    email: z.string().email('Email is mandatory'),
    phone: z.string().min(10, 'Phone number is mandatory'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default function SignUp() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof CustomerSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CustomerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
        },
    });



    const onSubmit = async (values: z.infer<typeof CustomerSchema>) => {
        try {
            setIsLoading(true);
            const {error, msg} = await createUser(values);
            if (!error) {
                await signIn("user", {
                    email: values.email,
                    password: values.password,
                    callbackUrl: "/",
                });
            }
            toast.error(msg);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEye = () => {
        setIsVisible(!isVisible);
    }

    return (
        <Form {...form}>
            <form
                className="flex md:w-[30%] flex-col gap-y-6 border-1 py-8 md:px-12 px-16 rounded-lg shadow-lg"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-semibold">
                        Hostel Management
                    </h1>
                    <p className="text-gray-500">Create a new account</p>
                </div>
                <FormField

                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
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
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password*</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={isVisible ? "text" : "password"} placeholder="Enter your password" {...field} />
                                    <span onClick={handleEye} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                                        {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit">Create New Account</Button>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500 text-sm">Already have an account? <Link href={"/auth/login"} className="text-blue-500 underline">sign in </Link></p>

                </div>
            </form>
        </Form>
    )
}
