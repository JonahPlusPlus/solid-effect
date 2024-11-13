import { Runtime } from "effect";
import {
  makeCreateEffectResource,
  type CreateEffectResourceSignature,
} from "../create-effect-resource";
import { makeRunAsync, type RunAsyncSignature } from "../run-async";
import {
  makeRunAsyncExit,
  type RunAsyncExitSignature,
} from "../run-async-exit";
import { makeRunSync, type RunSyncSignature } from "../run-sync";
import { makeRunSyncExit, type RunSyncExitSignature } from "../run-sync-exit";

interface SolidRuntime<R> {
  createEffectResource: CreateEffectResourceSignature<R>;
  RunAsync: RunAsyncSignature<R>;
  RunAsyncExit: RunAsyncExitSignature<R>;
  RunSync: RunSyncSignature<R>;
  RunSyncExit: RunSyncExitSignature<R>;
}

function makeRuntime<R>(runtime: Runtime.Runtime<R>): SolidRuntime<R> {
  const createEffectResource = makeCreateEffectResource(runtime);
  const RunAsync = makeRunAsync(createEffectResource);
  const RunAsyncExit = makeRunAsyncExit(createEffectResource);
  const RunSync = makeRunSync(runtime);
  const RunSyncExit = makeRunSyncExit(runtime);

  return {
    createEffectResource,
    RunAsync,
    RunAsyncExit,
    RunSync,
    RunSyncExit,
  };
}

export { type SolidRuntime, makeRuntime };
