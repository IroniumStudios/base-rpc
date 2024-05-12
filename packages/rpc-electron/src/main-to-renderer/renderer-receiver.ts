import { Receiver, RpcScaffold, clearEvents } from '@wexond/rpc-core';
import { RpcRendererHandler, RpcRendererObserver } from '../interfaces';
import { checkIpcContext, getIpcRenderer } from '../utils';

export class RendererReceiver<T extends RpcScaffold<T>> extends Receiver<RpcRendererHandler<T>, RpcRendererObserver<T>> {
  name: any;
  invokeRemoteHandler: any;
  createCaller: any;
  observers: any;
  handlers: any;
  constructor(name: string) {
    super(name);

    checkIpcContext();

    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) {
      throw new Error('IPC renderer is not available.');
    }

    // Prevent EventEmitter leaks.
    clearEvents(ipcRenderer, this.name);

    ipcRenderer.on(this.name, async (e: any, method: string, id: string, ...args: any) => {
      try {
        const caller = this.createCaller(method, e, ...args);
        const { res, error } = await this.invokeRemoteHandler(caller);

        ipcRenderer.send(`${this.name}${method}${id}`, res, error);

        this.observers.notify(caller);
      } catch (err) {
        console.error('Error handling RPC method:', err);
        ipcRenderer.send(`${this.name}${method}${id}`, null, err.message);
      }
    });
  }

  public destroy() {
    clearEvents(getIpcRenderer(), this.name);
  }

  /**
   * Add a method to register a new handler for a specific method name.
   * @param method The method name.
   * @param handler The handler function.
   */
  public registerHandler(method: string, handler: (args: any[]) => Promise<any>) {
    this.handlers.set(method, handler);
  }

  /**
   * Add a method to unregister a handler for a specific method name.
   * @param method The method name.
   */
  public unregisterHandler(method: string) {
    this.handlers.delete(method);
  }

  /**
   * Add a method to check if a handler is registered for a specific method name.
   * @param method The method name.
   * @returns True if a handler is registered, otherwise false.
   */
  public hasHandler(method: string): boolean {
    return this.handlers.has(method);
  }
}
