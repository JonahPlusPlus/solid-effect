import { type JSX, Match } from "solid-js";

function MatchTag<T extends { _tag: string }, S extends T["_tag"]>(props: {
  on: T | undefined;
  tag: S;
  children: (value: Extract<T, { _tag: S }>) => JSX.Element;
}): JSX.Element {
  return (
    <Match when={props.on?._tag == props.tag && props.on}>
      {(v) => props.children(v() as Extract<T, { _tag: S }>)}
    </Match>
  );
}

export { MatchTag };
