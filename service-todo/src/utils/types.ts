
/** Branded type */
declare const __brand: unique symbol
type Brand<T, B> = T & { [__brand]: B }

export type { Brand }