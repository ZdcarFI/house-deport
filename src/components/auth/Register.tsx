'use client'

import React, { useState } from 'react'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from "@nextui-org/select"
import { useRouter } from 'next/navigation'
import { UserService } from '@/services/User/UserService'
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon'
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon'

type FormData = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  confirmPassword: string
  gender: string
}

type ValidationErrors = {
  [K in keyof FormData]?: string
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const router = useRouter()
  const userService = new UserService()

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (formData.firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres'
    }
    if (formData.lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres'
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido'
    }
    if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    if (!formData.gender) {
      newErrors.gender = 'Seleccione un género'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...registrationData } = formData
      await userService.create(registrationData)
      router.push('/login?registered=true')
    } catch (error: any) {
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          setGeneralError(error.response.data.message.join('. '))
        } else {
          setGeneralError(error.response.data.message)
        }
      } else {
        setGeneralError('Error al crear la cuenta. Por favor, intente nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)

  return (
    <Card className="w-full max-w-lg bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-xl">
      <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
        <h2 className="text-2xl font-bold">Registro</h2>
        <p className="text-default-500">Únete a nuestra empresa</p>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              label="Nombre"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
              className="flex-1"
            />
            <Input
              label="Apellido"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              isRequired
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
              className="flex-1"
            />
          </div>
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="johndoe@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email}
          />
          <Input
            label="Nombre de Usuario"
            name="username"
            placeholder="johndoe123"
            value={formData.username}
            onChange={handleChange}
            isRequired
            isInvalid={!!errors.username}
            errorMessage={errors.username}
          />
          <Input
            label="Contraseña"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            isRequired
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            type={isPasswordVisible ? "text" : "password"}
            endContent={
              <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                )}
              </button>
            }
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            isRequired
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            type={isConfirmPasswordVisible ? "text" : "password"}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleConfirmPasswordVisibility}>
                {isConfirmPasswordVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                )}
              </button>
            }
          />
          <Select
            label="Género"
            placeholder="Seleccione un género"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            isRequired
            isInvalid={!!errors.gender}
            errorMessage={errors.gender}
          >
            <SelectItem key="MALE" value="MALE">Masculino</SelectItem>
            <SelectItem key="FEMALE" value="FEMALE">Femenino</SelectItem>
            <SelectItem key="other" value="other">Otro</SelectItem>
          </Select>

          {generalError && (
            <div className="bg-danger-100 text-danger-500 text-sm p-2 rounded-lg" role="alert">
              {generalError}
            </div>
          )}

          <Button 
            color="primary" 
            type="submit" 
            className="mt-4"
            isLoading={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>

          <div className="flex justify-between items-center mt-4">
            <p className="text-default-500">¿Ya tienes una cuenta?</p>
            <Button
              color="secondary"
              variant="flat"
              onPress={() => router.push('/login')}
              isDisabled={isLoading}
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}