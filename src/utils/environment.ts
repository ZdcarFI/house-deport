export const environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'MyApp',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    API: process.env.API || 'http://localhost:8000',
};