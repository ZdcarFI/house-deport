'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/services/Auth/AuthService'
import RegisterForm from '@/components/auth/Register'
import {CreateUserDto} from "@/services/User/dto/CreateUserDto";

export default function RegisterPage() {
    const router = useRouter()
    const authService = new AuthService()

    const handleRegister = async (user: CreateUserDto) => {
        try {
            await authService.register(user)
            router.push('/login')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    return (
       
            <RegisterForm onRegister={handleRegister} />
        

    )
}