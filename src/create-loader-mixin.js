import CreateLoader from "./create-loader";
import { isArray, isObject, isFunction, noop } from "./helper";

export default class CreateLoaderMixin extends CreateLoader {
  constructor(options = {}) {
    if (!isObject(options)) {
      throw new TypeError("Illegal parameter: options, expect an object.");
    }

    super(options);
    let loadModule = this.loadModule;

    const { modules, beforeLoad = noop, afterLoad = noop, onError = noop } = options;

    if (!isArray(modules) || modules.some(({ name, url }) => !name || !url)) {
      throw new TypeError(
        "Illegal parameter: options.modules, expect an object array (Array<{name: string, url: string}>).",
      );
    }

    return {
      watch: {
        $route({ path }) {
          if (path) {
            this.$_handleRouteChange(path);
          }
        },
      },

      methods: {
        // asynchronous loading module
        $_handleRouteChange(path) {
          const module = this.$_containerModules.find((m) => path.startsWith(`/${m.name}`));
          if (module && !module.status) {
            module.status = "pending";
            // before load callback
            if (isFunction(beforeLoad)) {
              beforeLoad(module);
            }

            this.$_containerLoader(module.url).then(({ type }) => {
              if (type === "load") {
                module.status = "load";
                // after load callback
                if (isFunction(afterLoad)) {
                  afterLoad(module);
                }
              } else {
                module.status = "error";
                // load error callback
                if (isFunction(onError)) {
                  onError(module);
                }
              }
            });
          }
        },
      },

      created() {
        this.$_containerModules = modules;
        this.$_containerLoader = loadModule;
        this.$_handleRouteChange(this.$route.path);
        loadModule = null;
      },

      beforeDestroy() {
        this.$_containerModules = null;
        this.$_containerLoader = null;
      },
    };
  }
}
