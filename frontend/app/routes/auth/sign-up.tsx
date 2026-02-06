import React from "react"
import { signUpSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { useSingnUpMutation } from "@/hooks/useAuth"
import { toast } from "sonner"

export type SignupFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
    const navigate = useNavigate()
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
        },
    })

    const {mutate, isPending} = useSingnUpMutation()

    const handleOnSubmit = (values: SignupFormData) => {
        mutate(values, {
            onSuccess: (data) => {
                toast.success("Email Verification Required", {
                    description: "Please check your email to verify your account.",
                })
                form.reset()
                navigate("/sign-in")
            },
            onError: (error:any) => {
                const errorMessage = error?.response?.data?.message || "Error signing up user."
                toast.error(errorMessage)
            },
        })

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Create an account to </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">

                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your name"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your c-password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Creating account..." : "Sign Up"}
                            </Button>
 
                        </form>
                    </Form>
                    <CardFooter>
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                                Don&apos; t have an account?{" "}
                                <Link to="/sign-in">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp
