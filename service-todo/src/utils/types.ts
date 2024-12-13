
/** Branded type */
declare const __brand: unique symbol
type Brand<T, B> = T & { [__brand]: B }

/** Entries type - useful to have a better types for Object.entries */
type Entries<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

export type { Brand, Entries }