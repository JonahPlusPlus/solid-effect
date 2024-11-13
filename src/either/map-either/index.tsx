import { Either } from "effect";
import { createMemo, type JSX, untrack } from "solid-js";

/**
 *
 * @param props
 * @returns An element mapped from a left or right value.
 */
function MapEither<R, L = never>(props: {
  /** An either value or undefined. */
  on: Either.Either<R, L> | undefined;
  /** An object containing functions `onLeft` and `onRight` for mapping `on`. */
  children: {
    readonly onLeft: (accessor: () => L) => JSX.Element;
    readonly onRight: (accessor: () => R) => JSX.Element;
  };
  /** A fallback value displayed when `on` is undefined. */
  fallback?: JSX.Element;
  /** Whether `children` should not use accessors. */
  keyed?: false;
}): JSX.Element;
function MapEither<R, L = never>(props: {
  /** An either value or undefined. */
  on: Either.Either<R, L> | undefined;
  /** An object containing functions `onLeft` and `onRight` for mapping `on`. */
  children: {
    readonly onLeft: (accessor: L) => JSX.Element;
    readonly onRight: (accessor: R) => JSX.Element;
  };
  /** A fallback value displayed when `on` is undefined. */
  fallback?: JSX.Element;
  /** Whether `children` should not use accessors. */
  keyed: true;
}): JSX.Element;
function MapEither<R, L = never>(props: {
  on: Either.Either<R, L> | undefined;
  children: {
    readonly onLeft: (accessor: L | (() => L)) => JSX.Element;
    readonly onRight: (accessor: R | (() => R)) => JSX.Element;
  };
  fallback?: JSX.Element;
  keyed?: boolean;
}): JSX.Element {
  const keyed = props.keyed;
  const lCondition = createMemo(
    () => props.on?._tag == "Left" && props.on.left,
  );
  const rCondition = createMemo(
    () => props.on?._tag == "Right" && props.on.right,
  );
  return createMemo(() => {
    const lC = lCondition();
    if (lC) {
      const left = props.children.onLeft;
      return untrack(() =>
        left(
          keyed
            ? lC
            : () => {
                if (!untrack(lCondition)) throw "Stale read from <MapEither>";
                return (props.on! as Either.Either<R, L> & { _tag: "Left" })
                  .left;
              },
        ),
      );
    }
    const rC = rCondition();
    if (rC) {
      const right = props.children.onRight;
      return untrack(() =>
        right(
          keyed
            ? rC
            : () => {
                if (!untrack(rCondition)) throw "Stale read from <MapEither>";
                return (props.on! as Either.Either<R, L> & { _tag: "Right" })
                  .right;
              },
        ),
      );
    }
    return props.fallback;
  }) as unknown as JSX.Element;
}

export { MapEither };
