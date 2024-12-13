/**
 * Config should be in a separate file, so we can easily change it for testing
 */

const DEFAULT_PORT = 3000;

const validateLogLevel = (logLevel: string): logLevel is "debug" | "info" | "warn" | "error" => {
    return ["debug", "info", "warn", "error"].includes(logLevel);
}

export const getConfig = (): Config => {

    const logLevel = process.env.LOG_LEVEL || "info";
    if (!validateLogLevel(logLevel)) {
        throw new Error(`Invalid log level: ${logLevel}`);
    }

    return {
        port: Number(process.env.PORT) || DEFAULT_PORT,
        logLevel,
    }
}

export type Config = {
    port: number;
    logLevel: "debug" | "info" | "warn" | "error";
}