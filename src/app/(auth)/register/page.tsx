'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/services/Auth/AuthService'
import RegisterForm from '@/components/auth/Register'

export default function RegisterPage() {
    const router = useRouter()
    const authService = new AuthService()

    const handleRegister = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
    }) => {
        try {
            // await authService.register(data)
            router.push('/login')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    return (
       
            <RegisterForm onRegister={handleRegister} />
        

    )
}