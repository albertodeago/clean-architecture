import type { Entries } from "./types";

const logLevel: Record<"debug" | "info" | "warn" | "error", number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

type LogLevel = keyof typeof logLevel;
type LogFn = (message: string, ...data: unknown[]) => void;

export const getLogger = (moduleName: string, level: LogLevel = "info") => {

    const levels =  Object.entries(logLevel) as Entries<typeof logLevel>;
    const consoleFn = levels.reduce<Record<LogLevel, LogFn>>((acc, [lvl, val]) => {
        acc[lvl] = (message: string, ...data: unknown[]) => {
            const currentLevel = logLevel[level];
            const targetLevel = val;

            if (currentLevel <= targetLevel) {
                console[lvl](`${moduleName}\n${lvl.toUpperCase()}: ${message}`, ...data, "\n");
            }
        }
        return acc;
    }, {} as Record<LogLevel, LogFn>);
    
    const getChild = (name: string) => getLogger(`${moduleName}.${name}`, level);

    return {
        ...consoleFn,
        getChild,
    }
};

export type Logger = ReturnType<typeof getLogger>;