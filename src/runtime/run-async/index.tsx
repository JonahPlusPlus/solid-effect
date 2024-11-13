import { Effect, pipe } from "effect";
import { createRenderEffect, type JSX } from "solid-js";
import { CreateEffectResourceSignature } from "../create-effect-resource";

interface RunAsyncProps<A, E, R> {
  effect: Effect.Effect<A, E, R>;
  children: (v: A) => JSX.Element;
}

type RunAsyncSignature<R> = <A, E>(
  props: RunAsyncProps<A, E, R>,
) => JSX.Element;

function makeRunAsync<R>(
  createEffectResource: CreateEffectResourceSignature<R>,
): RunAsyncSignature<R> {
  return function RunAsync<A, E = never>(
    props: RunAsyncProps<A, E, R>,
  ): JSX.Element {
    const [value, setEffect] = createEffectResource<JSX.Element, E>();

    createRenderEffect(() => {
      const effect = pipe(props.effect, Effect.map(props.children));
      setEffect(effect);
    });

    const error = () => {
      throw value.error;
    };

    return <>{value.error ? error() : value()}</>;
  };
}

export { type RunAsyncProps, type RunAsyncSignature, makeRunAsync };
