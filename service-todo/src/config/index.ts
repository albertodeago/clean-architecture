/**
 * Config should be in a separate file, so we can easily change it for testing
 */

const DEFAULT_PORT = 3000;

const validateLogLevel = (logLevel: string): logLevel is "debug" | "info" | "warn" | "error" => {
    return ["debug", "info", "warn", "error"].includes(logLevel);
}

const validateMonitoring = (dns?: string): dns is string => {
    return typeof dns === "string" && dns.length > 0 && dns.startsWith("http");
}

export const getConfig = (): Config => {

    const logLevel = process.env.LOG_LEVEL || "info";
    if (!validateLogLevel(logLevel)) {
        throw new Error(`Invalid log level: ${logLevel}`);
    }

    const monitoringDns = process.env.MONITORING_DNS;
    if (!validateMonitoring(monitoringDns)) {
        throw new Error("Monitoring DNS is required");
    }

    return {
        port: Number(process.env.PORT) || DEFAULT_PORT,
        logLevel,
        monitoring: {
            dns: monitoringDns
        }
    }
}

export type Config = {
    monitoring: {
        dns: string;
    },
    port: number;
    logLevel: "debug" | "info" | "warn" | "error";
}