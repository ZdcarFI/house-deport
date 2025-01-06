'use client';

import {useState, FormEvent, useContext} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@nextui-org/button';
import {Input} from '@nextui-org/input';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {EyeFilledIcon} from '@/components/icons/EyeFilledIcon';
import {EyeSlashFilledIcon} from '@/components/icons/EyeSlashFilledIcon';
import {MailIcon, LockIcon} from 'lucide-react';
import {AuthContext} from "@/context/AuthContext/authContext";

export default function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorForm, setErrorForm] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const { loginUser } = useContext(AuthContext)!;

    const toggleVisibility = () => setIsVisible(!isVisible);

    const validateForm = () => {

        if (password.length < 6) {
            setErrorForm('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorForm('');

        if (!validateForm()) return;

        try {
            await loginUser(email, password);
            router.push('/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setErrorForm('Credenciales incorrectas');
        }
    };

    return (
        <Card className="w-full max-w-md bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg">
            <CardHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-default-500">Ingrese sus credenciales para acceder</p>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        isRequired
                        label="Correo Electrónico"
                        placeholder="nombre@ejemplo.com"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        startContent={<MailIcon className="text-default-400" size={16}/>}
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
                    {errorForm && (
                        <div className="bg-danger-100 text-danger-500 text-sm p-2 rounded-lg" role="alert">
                            {errorForm}
                        </div>
                    )}
                    <Button color="primary" type="submit" className="mt-2">
                        Ingresar
                    </Button>
                    <Button
                        color="secondary"
                        variant="flat"
                        onPress={() => router.push('/')}
                    >
                        Regresar
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}