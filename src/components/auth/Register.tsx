"use client"
import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { useRouter } from 'next/navigation';

type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

type RegisterFormProps = {
    onRegister: (data: Omit<RegisterFormData, 'confirmPassword'>) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        const { confirmPassword, ...registrationData } = formData;
        onRegister(registrationData);
    };

    return (
        <Card className="bg-white/10 backdrop-blur-md shadow-xl">
            <CardHeader className="pb-0 pt-6 px-4 flex-col items-start">
                <h2 className="text-2xl font-bold ">Registro</h2>
                <p className="text-tiny ">Únete a nuestra empresa</p>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Input
                            label="Nombre"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="flex-1"
                        />
                        <Input
                            label="Apellido"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="flex-1"
                        />
                    </div>
                    <Input
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        placeholder="johndoe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Nombre de Usuario"
                        name="username"
                        placeholder="johndoe123"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <Button color="primary" type="submit" className="mt-4">
                        Crear Cuenta
                    </Button>
                    <div className="flex justify-between mt-4">
                        <p >¿Ya tienes una cuenta?</p>
                        <Button
                            color="secondary"
                            variant="flat"
                            onPress={() => router.push('/login')} // Cambia la ruta según sea necesario
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}
