declare module "array-includes" {
  export default function <T>(
    array: Array<T>,
    searchEelement: T,
    fromIndex?: number
  ): boolean;
}
