import { Cause, Exit } from "effect";
import { createMemo, type JSX, untrack } from "solid-js";

/**
 *
 * @param props
 * @returns An element mapped from a successful value or a cause of failure.
 */
function MapExit<T, E = never>(props: {
  /** An exit value or undefined. */
  on: Exit.Exit<T, E> | undefined;
  /** An object containing functions `onLeft` and `onRight` for mapping `on`. */
  children: {
    readonly onSuccess: (accessor: () => T) => JSX.Element;
    readonly onFailure: (accessor: () => Cause.Cause<E>) => JSX.Element;
  };
  /** A fallback value displayed when `on` is undefined. */
  fallback?: JSX.Element;
  /** Whether `children` should not use accessors. */
  keyed?: false;
}): JSX.Element;
function MapExit<T, E = never>(props: {
  /** An exit value or undefined. */
  on: Exit.Exit<T, E> | undefined;
  /** An object containing functions `onLeft` and `onRight` for mapping `on`. */
  children: {
    readonly onSuccess: (accessor: T) => JSX.Element;
    readonly onFailure: (accessor: Cause.Cause<E>) => JSX.Element;
  };
  /** A fallback value displayed when `on` is undefined. */
  fallback?: JSX.Element;
  /** Whether `children` should not use accessors. */
  keyed: true;
}): JSX.Element;
function MapExit<T, E = never>(props: {
  on: Exit.Exit<T, E> | undefined;
  children: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly onSuccess: (accessor: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly onFailure: (accessor: any) => JSX.Element;
  };
  fallback?: JSX.Element;
  keyed?: boolean;
}): JSX.Element {
  const keyed = props.keyed;
  const tCondition = createMemo(
    () => props.on?._tag == "Success" && props.on.value,
  );
  const eCondition = createMemo(
    () => props.on?._tag == "Failure" && props.on.cause,
  );
  return createMemo(() => {
    const tC = tCondition();
    if (tC) {
      const succeed = props.children.onSuccess;
      return untrack(() =>
        succeed(
          keyed
            ? tC
            : () => {
                if (!untrack(tCondition)) throw "Stale read from <MapExit>";
                return (props.on! as Exit.Exit<T, E> & { _tag: "Success" })
                  .value;
              },
        ),
      );
    }
    const eC = eCondition();
    if (eC) {
      const fail = props.children.onFailure;
      return untrack(() =>
        fail(
          keyed
            ? eC
            : () => {
                if (!untrack(eCondition)) throw "Stale read from <MapExit>";
                return (props.on! as Exit.Exit<T, E> & { _tag: "Failure" })
                  .cause;
              },
        ),
      );
    }
    return props.fallback;
  }) as unknown as JSX.Element;
}

export { MapExit };
