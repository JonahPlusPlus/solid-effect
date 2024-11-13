import { type Cause, Effect, Exit, pipe, Runtime } from "effect";
import { createRenderEffect, createSignal, type JSX } from "solid-js";

interface RunSyncExitProps<A, E, R> {
  effect: Effect.Effect<A, E, R>;
  children: {
    readonly onFailure: (error: Cause.Cause<E>) => JSX.Element;
    readonly onSuccess: (value: A) => JSX.Element;
  };
}

type RunSyncExitSignature<R> = <A, E>(
  props: RunSyncExitProps<A, E, R>,
) => JSX.Element;

function makeRunSyncExit<R>(
  runtime: Runtime.Runtime<R>,
): RunSyncExitSignature<R> {
  return function RunSync<A, E>(props: RunSyncExitProps<A, E, R>): JSX.Element {
    const [value, setValue] = createSignal<JSX.Element>();

    createRenderEffect(() => {
      const effect = pipe(
        props.effect,
        Effect.exit,
        Effect.andThen(Exit.match(props.children)),
      );
      setValue(() => Runtime.runSync(runtime)(effect));
    });

    return <>{value()!}</>;
  };
}

export { type RunSyncExitProps, type RunSyncExitSignature, makeRunSyncExit };
