import { Effect, Runtime } from "effect";
import {
  type Setter,
  type Resource,
  type ResourceActions,
  createResource,
  createSignal,
  ResourceOptions,
} from "solid-js";

type CreateEffectResourceSignature<R> = <A, E>() => [
  Resource<A>,
  Setter<Effect.Effect<A, E, R> | null>,
  ResourceActions<A | undefined>,
];

function makeCreateEffectResource<R>(
  runtime: Runtime.Runtime<R>,
): CreateEffectResourceSignature<R> {
  return function createEffectResource<A, E>(
    options?: ResourceOptions<A>,
  ): [
    Resource<A>,
    Setter<Effect.Effect<A, E, R> | null>,
    ResourceActions<A | undefined>,
  ] {
    const [effect, setEffect] = createSignal<Effect.Effect<A, E, R> | null>(
      null,
    );
    const [resource, actions] = createResource<A, Effect.Effect<A, E, R>>(
      effect,
      (src) => Runtime.runPromise(runtime)(src),
      options,
    );
    return [resource, setEffect, actions];
  };
}

export { type CreateEffectResourceSignature, makeCreateEffectResource };
