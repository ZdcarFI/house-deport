import {AlertCircle} from "lucide-react";

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                        <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400"/>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Acceso No Autorizado
                </h1>

                <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
                    </p>
                </div>

                <div className="pt-4">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Volver al Inicio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
