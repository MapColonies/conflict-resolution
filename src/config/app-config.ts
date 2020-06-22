require('dotenv').config();

export const {
APP_NAME,
APP_HOST,
APP_PORT,
APP_VERSION,
APP_PROTOCOL,
NODE_ENV = 'development'
} = process.env

export const IN_PROD = NODE_ENV === 'production'

export const APP_URL = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`