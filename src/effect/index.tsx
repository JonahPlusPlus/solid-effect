import { Runtime } from "effect";
import { makeRuntime } from "../runtime";

const { createEffectResource, RunAsync, RunAsyncExit, RunSync, RunSyncExit } =
  makeRuntime(Runtime.defaultRuntime);

export { createEffectResource, RunAsync, RunAsyncExit, RunSync, RunSyncExit };
