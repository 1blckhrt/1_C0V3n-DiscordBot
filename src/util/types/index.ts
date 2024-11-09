export type Predicate<T> = (structure: unknown) => structure is T;

export * from "./command.js";
export * from "./event.js";
export * from "./component.js";
