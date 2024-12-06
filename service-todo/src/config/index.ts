/**
 * Config should be in a separate file, so we can easily change it for testing
 */

const DEFAULT_PORT = 3000;

export const getConfig = () => {
    return {
        port: process.env.PORT || DEFAULT_PORT
    }
}

export type Config = ReturnType<typeof getConfig>;