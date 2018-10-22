import { isArray, isObject, addTimestamp } from "./helper";
import { DEFAULT_SHARED_POOL_NAME } from "./constant";

/**
 * module loader
 *
 * @export
 * @class createLoader
 */
export class CreateLoader {
  constructor(options = {}) {
    if (!isObject(options)) {
      throw new TypeError("Illegal parameter: options, expect an object.");
    }

    const _global = options.global || window;
    const _poolName = options.poolName || DEFAULT_SHARED_POOL_NAME;
    this.pool = _global[_poolName] = {}; // shared pool
    this.noCache = typeof options.cache === "undefined" ? true : !!options.cache;
  }

  /**
   * mount vue-router instance
   *
   * @param {*} router
   * @memberof createLoader
   */
  mountRouter(router) {
    this.pool.router = router;
  }

  /**
   * mount vuex instance
   *
   * @param {*} store
   * @memberof createLoader
   */
  mountStore(store) {
    this.pool.store = store;
  }

  /**
   * remove global pool
   *
   * @memberof createLoader
   */
  remove() {
    const pool = this.pool;
    Object.keys(pool).forEach((v) => {
      delete pool[v];
    });
  }

  /**
   * load module
   *
   * @param {*} url
   * @returns {Promise}
   * @memberof createLoader
   *
   * @example
   * loadModule('/path/to/module.js').then((res) => { console.log(res) })
   */
  loadModule(url) {
    if (!url || typeof url !== "string") {
      return Promise.reject("Illegal parameter: url, expect a not empty string.");
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.onload = ({ type }) => resolve({ type, url });
      script.onerror = ({ type }) => resolve({ type, url });
      script.src = this.noCache ? addTimestamp(url) : url;
      document.body.appendChild(script);
    });
  }

  /**
   * load modules
   *
   * @param {*} [urls=[]]
   * @returns {Promise}
   * @memberof createLoader
   *
   * @example
   * loadModules(['/path/to/module-1.js', '/path/to/module-2.js']).then((res) => { console.log(res) })
   */
  loadModules(urls = []) {
    if (!isArray(urls)) {
      return Promise.reject("Illegal parameter: urls, expect an array.");
    }

    return Promise.all(urls.map((v) => this.loadModule(v))).then((res) => {
      // this.remove();
      return res;
    });
  }
}
