'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/services/Auth/AuthService'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon'
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon'
import { MailIcon, LockIcon, UserIcon } from 'lucide-react'

export default function LoginForm() {
  const [isEmailLogin, setIsEmailLogin] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const authService = new AuthService()

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleLoginMethod = () => {
    setIsEmailLogin(!isEmailLogin)
    setIdentifier('')
    setError('')
  }

  const validateForm = () => {
    if (!identifier) {
      setError(isEmailLogin ? 'El correo electrónico es requerido.' : 'El nombre de usuario es requerido.')
      return false
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return
    setIsLoading(true)
    try {
      const user = isEmailLogin 
        ? await authService.login(identifier, password)
        : await authService.loginUsername(identifier, password)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifique sus credenciales.')
      console.error('Error de inicio de sesión', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-6">
        <h1 className="text-2xl font-bold">Bienvenido</h1>
        <p className="text-default-500">Ingrese sus credenciales para acceder</p>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            isRequired
            label={isEmailLogin ? "Correo Electrónico" : "Nombre de Usuario"}
            placeholder={isEmailLogin ? "nombre@ejemplo.com" : "usuario123"}
            type={isEmailLogin ? "email" : "text"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            startContent={
              isEmailLogin 
                ? <MailIcon className="text-default-400" size={16}/> 
                : <UserIcon className="text-default-400" size={16}/>
            }
          />
          <Input
            isRequired
            label="Contraseña"
            placeholder="••••••••"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startContent={<LockIcon className="text-default-400" size={16}/>}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                )}
              </button>
            }
          />
          {error && (
            <div className="bg-danger-100 text-danger-500 text-sm p-2 rounded-lg" role="alert">
              {error}
            </div>
          )}
          <Button color="primary" type="submit" className="mt-2" isLoading={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
          <div className="flex justify-between items-center mt-4">
            <Button
              color="secondary"
              variant="light"
              onPress={toggleLoginMethod}
              className="text-sm"
            >
              Usar {isEmailLogin ? 'usuario' : 'correo electrónico'}
            </Button>
            <Button
              color="secondary"
              variant="flat"
              onPress={() => router.push('/register')}
              className="text-sm"
            >
              Crear una cuenta
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}