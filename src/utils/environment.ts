export const environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'MyApp',
    JWT_SECRET: process.env.JWT_SECRET || 'exampled_secret',
    API: process.env.API || 'https://innocent-busy-aardvark.ngrok-free.app',
};