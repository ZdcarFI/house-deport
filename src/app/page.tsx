"use client"

import React from 'react';
import {Button} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();
    return (
        <div className="h-screen text-white ">
            {/* Hero Section */}
            <section
                id="home"
                className="h-screen relative flex items-center justify-center min-h-[80vh] md:min-h-screen px-6 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/imgs/sports-banner.jpeg')`,
                }}
            >

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Navbar */}
                <nav className="absolute top-0 left-0 right-0 px-6 py-4 flex justify-center items-center gap-4">
                    <h1 className="text-lg font-bold leading-tight text-white">HOUSE DEPORT</h1>
                    <Image
                        src="/icons/logo-blue.ico"
                        alt="loading-skeleton"
                        width={50} height={50} />
                </nav>

                {/* Content */}
                <div className="relative z-10 text-center md:text-left max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        SÉ TU <span className="text-primary">MEJOR</span> VERSIÓN
                    </h2>
                    <p className="mt-4 text-gray-300 text-lg">
                        Tienda de ropa deportiva para escuelas en San Jerónimo, Huancayo.
                        Ofrecemos calidad, estilo y comodidad.
                    </p>
                    <Button
                        color="primary"
                        variant="solid"
                        className="mt-6 text-black font-semibold px-6 py-3"
                        onClick={() => router.push('/login')}
                    >
                        Acceso Trabajadores
                    </Button>
                </div>

                {/* Footer */}
                <footer className="absolute  bottom-0 left-0 right-0 px-6 py-4  bg-gray-900 py-4 text-center text-sm text-gray-500">
                    <p>&copy; 2025 HOUSE DEPORT. Todos los derechos reservados.</p>
                </footer>
            </section>


        </div>
    );
};

export default Page;