import { Cause, Effect, Exit, pipe } from "effect";
import { createEffect, type JSX } from "solid-js";
import { CreateEffectResourceSignature } from "../create-effect-resource";

interface RunAsyncExitProps<A, E, R> {
  effect: Effect.Effect<A, E, R>;
  children: {
    readonly onSuccess: (value: A) => JSX.Element;
    readonly onFailure: (error: Cause.Cause<E>) => JSX.Element;
  };
}

type RunAsyncExitSignature<R> = <A, E>(
  props: RunAsyncExitProps<A, E, R>,
) => JSX.Element;

function makeRunAsyncExit<R>(
  createEffectResource: CreateEffectResourceSignature<R>,
): RunAsyncExitSignature<R> {
  return function RunAsyncExit<A, E = never>(
    props: RunAsyncExitProps<A, E, R>,
  ): JSX.Element {
    const [value, setEffect] = createEffectResource();

    createEffect(() => {
      const effect = pipe(
        props.effect,
        Effect.exit,
        Effect.andThen(Exit.match(props.children)),
      );
      setEffect(effect);
    });

    return <>{value()}</>;
  };
}

export { type RunAsyncExitProps, type RunAsyncExitSignature, makeRunAsyncExit };
