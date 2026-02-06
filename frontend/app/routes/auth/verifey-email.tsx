import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState, useEffect } from 'react'
import {Link, useSearchParams} from 'react-router'
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react'   // ✅ ArrowLeft import
import { Button } from '@/components/ui/button'
import { useVerifyEmailMutation } from '@/hooks/useAuth'



const VerifeyEmail = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [isSuccess, setIsSuccess] =  useState(false)

    const {mutate, isPending: isVerifying} = useVerifyEmailMutation()

    useEffect(() => {
        if (token) {
            setIsSuccess(false)
           mutate({token},{
            onSuccess: () => {
                setIsSuccess(true)
            },
            onError: (error) => {
                setIsSuccess(false)
                console.log(error);
                
            }
           })
        }
    }, [searchParams])


    
   
    return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-2xl font-bold'>Verify Email</h1>
        <p className='text-sm text-gray-500'>Verifying your email.....</p>

        <Card className='w-full max-w-md'>
            {/* <CardHeader>
                <Link to="/sign-in" className='flex items-center gap-2 text-sm'>
                <ArrowLeft className='w-4 h-4 mr-2'/>
                Back to sign in</Link> 
            </CardHeader> */}

            <CardContent>
                <div className='flex flex-col items-center justify-center py-6'>
                   {isVerifying ? 
                   <>
                   <Loader className='w-10 h-10 text-gray-500 animate-spin'/>
                   <h3 className='text-lg font-semibold'>Verifying email...</h3>
                   <p className='text-sm text-gray-500'>
                        Please wait while we verify your email .
                   </p>
                   </> 
                   : isSuccess ? (
                        <>
                        <CheckCircle className='w-10 h-100 text-green-500' />
                        <h3 className='text-lg font-semibold'>Email Verified</h3>
                        <p className='text-sm text-gray-500'>
                            Your email has been successfully verified
                        </p>
                        <Link to="/sign-in" className='text-sm text-blue-500 underline mt-2'>
                           <Button variant= "outline">Back to Sigin in</Button>
                        </Link>
                        </>
                    ) : (
                        <>
                        <XCircle className='w-10 h-10 text-red-500'/>
                        <h3 className='text-lg font-semibold'>Email Verification Failed</h3>
                        <p className='text-sm text-gray-500'>
                            Your email verified failed . Please try again.
                        </p>
                        <Link to="/sign-in" className='text-sm text-blue-500 underline mt-2'>
                           <Button variant= "outline">Back to Sigin in</Button>
                        </Link>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default VerifeyEmail
