declare module "object.entries" {
  export default function <T>(
    o: { [s: string]: T } | ArrayLike<T>
  ): [string, T][];
}
