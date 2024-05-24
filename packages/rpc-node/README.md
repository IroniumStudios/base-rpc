# @ironiumstudios/rpc-node

Type-safe communication between message ports from Node.js worker_threads module.

## NOTE:

this project is licensed under the company wexond, i am only forking this project to modernize it and i wish for no trouble from the wexond devs or redbrick

[![NPM](https://img.shields.io/npm/v/@ironiumstudios/rpc-node.svg?style=flat-square)](https://www.npmjs.com/package/@ironiumstudios/rpc-node)
[![NPM](https://img.shields.io/npm/dm/@ironiumstudios/rpc-node?style=flat-square)](https://www.npmjs.com/package/@ironiumstudios/rpc-node)

## Installation

```bash
$ npm install --save @ironiumstudios/rpc-node @ironiumstudios/rpc-core
```

## Quick start

Here's an example of communication from the main thread to a `worker_thread`:

- Create a file that is imported in both the `worker_thread` and the main thread, for example `ping-pong.ts`:

```ts
import { WorkerChannel } from '@ironiumstudios/rpc-node';

export interface PingPongService {
  ping(): string;
}

export const pingPongChannel = new WorkerChannel<PingPongService>('ping-pong');
```

- Code for your `worker_thread`:

```ts
import { RpcWorkerHandler } from '@ironiumstudios/rpc-node';
import { PingPongService, pingPongChannel } from './ping-pong';

class PingPongHandler implements RpcWorkerHandler<PingPongService> {
  // Equivalent of |parentPort.on('message')|
  ping(): string {
    return 'pong';
  }
}

// |parentPort| is the default value for the |messagePort| parameter in |getReceiver|.
pingPongChannel.getReceiver().handler = new PingPongHandler();
```

- Code for the main thread:

```ts
import { resolve } from 'path';
import { Worker } from 'worker_threads';

import { pingPongChannel } from './ping-pong';

const worker = new Worker('path/to/worker.js');
const pingPongService = pingPongChannel.getInvoker(worker);

(async () => {
  console.log(await pingPongService.ping()); // Prints `pong`.
})();
```

### More examples

- [Main to Worker](examples/main-to-worker)

## Documentation

WIP
