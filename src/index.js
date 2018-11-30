function getType(v) {
  return Object.prototype.toString.call(v);
}

function isArray(a) {
  return getType(a) === "[object Array]";
}

function isObject(o) {
  return getType(o) === "[object Object]";
}

function isFunction(func) {
  return getType(func) === "[object Function]";
}

function ContainerHelper(options = {}) {
  this.moduleName = options.name;
  this.poolTarget = options.poolTarget || window;
  this.poolName = options.poolName || "__shared_pool__";
  this.pool = this.initSharedPool(this.poolTarget, this.poolName);
  this.mountStoreInstance(options.store);
}

/**
 * init shared pool
 *
 * @param {object} target
 * @param {string} name
 * @returns pool
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.initSharedPool = function(target, name) {
  if (typeof target[name] === "undefined") {
    Object.defineProperty(target, name, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create(null),
    });
  }
  return target[name];
};

/**
 * mount shared methods
 *
 * @param {object} [methodsMap={}]
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.mountSharedMethods = function(methodsMap = {}) {
  Object.defineProperties(
    this.pool,
    Object.entries(methodsMap).reduce((acc, [k, v]) => {
      acc[k] = {
        get() {
          return v;
        },
      };
      return acc;
    }, {}),
  );
};

/**
 * mount routes
 *
 * @param {array} routes
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.mountRoutes = function(routes) {
  if (isArray(routes)) {
    const existedRoutes = this.pool.routes || [];
    this.pool.routes = existedRoutes.concat(routes);
  }
};

/**
 * get routes
 *
 * @returns {array} routes
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.getRoutes = function() {
  const routes = this.pool.routes || [];
  delete this.pool.routes; // remove routes
  return routes;
};

/**
 * mount store instance
 *
 * @param {object} storeInstance
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.mountStoreInstance = function(storeInstance) {
  if (isObject(storeInstance)) {
    Object.defineProperty(this.pool, "_store", {
      get() {
        return storeInstance;
      },
    });
  }
};

/**
 * register store module
 *
 * @param {object} storeModule
 * @memberof ContainerHelper
 */
ContainerHelper.prototype.registerModule = function(storeModule) {
  if (!this.moduleName) {
    throw new TypeError(
      "The name field must be supplied when instantiating the `ContainerHelper`.",
    );
  }

  const storeInstance = this.pool._store;
  if (
    isObject(storeInstance) &&
    isFunction(storeInstance.registerModule) &&
    isObject(storeModule)
  ) {
    storeInstance.registerModule(this.moduleName, storeModule);
  }
};

export default ContainerHelper;
