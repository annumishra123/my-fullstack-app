import React, { useState } from "react";
import { resetPasswordSchema } from '@/lib/schema'
import { z } from 'zod'
import { Link, useSearchParams } from "react-router";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CheckCheck, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/hooks/useAuth";
import { toast } from "sonner";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>


function ResetPassword() {
    const [seachParams] = useSearchParams()
    const token = seachParams.get("token")

    const [isSuccess, setSuccess] = useState(false)
    const [isLoading, setIsloading] = useState(false)

    const {mutate: resetPassword, isPending} = useResetPasswordMutation()

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        }
    })

    const onSubmit = (values: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Invalid token.")
            return
        }
        resetPassword(
            {...values,token: token as string},
            {
                onSuccess: ()=>{
                    setSuccess(true)
                },
                onError: (error: any)=>{
                    const errorMessage = error.response?.data?.message
                    toast.error(errorMessage)
                }
            }
        )
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">Enter your password below</p>
                </div>
                <Card>
                    <CardHeader>
                        <Link to="/sign-in" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to sign in</span>
                        </Link>
                    </CardHeader>

                    <CardHeader>
                        {
                            isSuccess ? (
                                <div className="flex flex-col items-center justify-center">
                                    <CheckCheck className="w-10 h-10 text-green-500" />
                                    <h1 className="text-2xl font-bold">Password reset successful</h1>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                                        <FormField
                                            name="newPassword"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="confirmPassword"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            {isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </Button>

                                    </form>
                                </Form>
                            )
                        }
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}

export default ResetPassword





