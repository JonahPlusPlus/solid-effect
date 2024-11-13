import { Effect, Runtime } from "effect";
import { createRenderEffect, createSignal, type JSX } from "solid-js";

interface RunSyncProps<A, E, R> {
  effect: Effect.Effect<A, E, R>;
  children: (v: A) => JSX.Element;
}

type RunSyncSignature<R> = <A, E>(props: RunSyncProps<A, E, R>) => JSX.Element;

function makeRunSync<R>(runtime: Runtime.Runtime<R>): RunSyncSignature<R> {
  return function RunSync<A, E>(props: RunSyncProps<A, E, R>): JSX.Element {
    const [value, setValue] = createSignal<JSX.Element>();

    createRenderEffect(() => {
      const effect = Effect.andThen(props.effect, props.children);
      setValue(() => Runtime.runSync(runtime)(effect));
    });

    return <>{value()}</>;
  };
}

export { type RunSyncProps, type RunSyncSignature, makeRunSync };
