declare type ReplaceUnknownWithAny<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown>
    ? ReplaceUnknownWithAny<T[K]>
    : T[K] extends unknown
    ? any
    : T[K];
}

declare type EventsOnly<T> = {
    [K in keyof T as K extends `on${string}` ? K : never]: T[K]
}