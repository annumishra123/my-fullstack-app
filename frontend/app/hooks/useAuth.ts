import {useMutation} from '@tanstack/react-query'
import type {SignupFormData} from '@/routes/auth/sign-up'
import { posData } from '@/lib/fetch-util'
export const useSingnUpMutation = ()=> {
    return useMutation({
        mutationFn: async (data: SignupFormData) => posData('/auth/register', data)
    })
}


export const useVerifyEmailMutation = ()=> {
    return useMutation({
        mutationFn: async (data :{token: string}) => posData('/auth/verify-email', data)
    })
}

export const useLoginMutation = ()=> {
    return useMutation({
        mutationFn: async (data :{email: string; password:string}) => posData('/auth/login', data)
    })
}


export const useForgetPasswordMutation = ()=> {
    return useMutation({
        mutationFn: async (data :{email: string}) => posData('/auth/reset-password-request', data)
    })
}



export const useResetPasswordMutation = ()=> {
    return useMutation({
        mutationFn: async (data :{token: string, newPassword: string, confirmPassword: string}) => posData('/auth/reset-password', data)
    })
}