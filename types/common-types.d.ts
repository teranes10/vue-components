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

declare type ToUnion<T, Key extends string = 'key', Value extends string = 'value', Prefix extends string = ''> = {
  [K in keyof T]: { [P in Key]: `${Prefix}${K & string}` } & { [Q in Value]: T[K] };
}[keyof T]

declare type RemovePrefix<T extends string, Prefix extends string> =
    T extends `${Prefix}${infer Rest}` ? Rest : T

declare type ToComponentUnion<T> = {
  [K in keyof T]: T[K] & { _type: K };
}[keyof T]
