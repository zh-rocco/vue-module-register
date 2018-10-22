import { isArray, isObject, isFunction } from "./helper";
import { DEFAULT_SHARED_POOL_NAME } from "./constant";

/**
 * module register
 *
 * @export
 * @class createRegister
 */
export class CreateRegister {
  constructor(options = {}) {
    if (!isObject(options)) {
      throw new TypeError("Illegal parameter: options, expect an object.");
    }

    if (!options.name) {
      throw new TypeError("Illegal parameter: options, expect has a 'name' field.");
    }

    const _global = options.global || window;
    const _poolName = options.poolName || DEFAULT_SHARED_POOL_NAME;
    this.pool = _global[_poolName] || {}; // shared pool
    this.hasLog = typeof options.log === "undefined" ? true : !!options.log;
    this.moduleName = options.name;
  }

  /**
   * register vue-router
   *
   * @returns {createRegister}
   * @memberof createRegister
   */
  addRoutes(routes) {
    const routerInstance = this.pool.router;
    if (isObject(routerInstance) && isFunction(routerInstance.addRoutes) && isArray(routes)) {
      routerInstance.addRoutes(routes);
      this.log("register routes");
    }

    return this;
  }

  /**
   * register vuex module
   *
   * @returns {createRegister}
   * @memberof createRegister
   */
  registerModule(store) {
    const storeInstance = this.pool.store;
    if (isObject(storeInstance) && isFunction(storeInstance.registerModule) && isObject(store)) {
      storeInstance.registerModule(this.moduleName, store);
      this.log("register store");
    }

    return this;
  }

  log(msg) {
    // eslint-disable-next-line no-console
    this.hasLog && console.log(`[${this.moduleName}]:`, msg);
  }
}
