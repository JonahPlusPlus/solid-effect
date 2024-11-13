import { Option } from "effect";
import { createMemo, type JSX, untrack } from "solid-js";

/**
 *
 * @param props
 * @returns An element mapped from some value or nothing.
 */
function MapOption<T>(props: {
  /** The optional value to map on. */
  on: Option.Option<T> | undefined;
  children: (accessor: () => T) => JSX.Element;
  fallback?: JSX.Element;
  keyed?: false;
}): JSX.Element;
function MapOption<T>(props: {
  /** The optional value to map on. */
  on: Option.Option<T> | undefined;
  children: (value: T) => JSX.Element;
  fallback?: JSX.Element;
  keyed: true;
}): JSX.Element;
function MapOption<T>(props: {
  /** The optional value to map on. */
  on: Option.Option<T> | undefined;
  children: (accessor: T | (() => T)) => JSX.Element;
  fallback?: JSX.Element;
  keyed?: boolean;
}): JSX.Element {
  const keyed = props.keyed;
  const condition = createMemo(
    () => props.on?._tag == "Some" && props.on.value,
  );
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      return untrack(() =>
        child(
          keyed
            ? (c as T)
            : () => {
                if (!untrack(condition)) throw "Stale read from <MapOption>";
                return (props.on! as Option.Option<T> & { _tag: "Some" }).value;
              },
        ),
      );
    }
    return props.fallback;
  }) as unknown as JSX.Element;
}

export { MapOption };
