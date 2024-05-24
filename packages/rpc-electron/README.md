# @ironiumstudios/rpc-electron

Type-safe communication between Electron processes.
No more remembering IPC channel names, parameters order and their types.

## NOTE:

this project is licensed under the company wexond, i am only forking this project to modernize it and i wish for no trouble from the wexond devs or redbrick

[![NPM](https://img.shields.io/npm/v/@ironiumstudios/rpc-electron.svg?style=flat-square)](https://www.npmjs.com/package/@ironiumstudios/rpc-electron)
[![NPM](https://img.shields.io/npm/dm/@ironiumstudios/rpc-electron?style=flat-square)](https://www.npmjs.com/package/@ironiumstudios/rpc-electron)

## Installation

```bash
$ npm install --save @ironiumstudios/rpc-electron @ironiumstudios/rpc-core
```

## Quick start

Here's an example of communication from the renderer process to the main process:

- Create a file that is imported in both main and renderer processes, for example `ping-pong.ts`:

```ts
import { RendererToMainChannel } from '@ironiumstudios/rpc-electron';

export interface PingPongService {
  ping(): string;
}

export const pingPongChannel = new RendererToMainChannel<PingPongService>(
  'ping-pong',
);
```

- Code for the renderer process:

```ts
import { ipcRenderer } from 'electron';
import { pingPongChannel } from './ping-pong';

const pingPongService = pingPongChannel.getInvoker();

(async () => {
  // Equivalent of |ipcRenderer.invoke|
  console.log(await pingPongService.ping()); // Prints `pong`.
})();
```

- Code for the main process:

```ts
import { RpcMainHandler } from '@ironiumstudios/rpc-electron';
import { PingPongService, pingPongChannel } from './ping-pong';

// Equivalent of |ipcMain.handle|
class PingPongHandler implements RpcMainHandler<PingPongService> {
  ping(): string {
    return 'pong';
  }
}

pingPongChannel.getReceiver().handler = new PingPongHandler();
```

### More examples

- [Renderer to Main](examples/renderer-to-main)

## Documentation

WIP
