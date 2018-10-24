import CreateLoader from "./create-loader";
import { isArray, isObject, isFunction, noop } from "./helper";

export default class CreateLoaderMixin extends CreateLoader {
  constructor(options = {}) {
    if (!isObject(options)) {
      throw new TypeError("Illegal parameter: options, expect an object.");
    }

    super(options);
    let loadModule = this.loadModule.bind(this);

    const { modules, beforeLoad = noop, afterLoad = noop, onError = noop } = options;

    if (!isArray(modules) || modules.some(({ name, url }) => !name || !url)) {
      throw new TypeError(
        "Illegal parameter: options.modules, expect an object array (Array<{name: string, url: string}>).",
      );
    }

    return {
      methods: {
        // asynchronous loading module
        $_handleRouteChange(path) {
          const module = modules.find((m) => path.startsWith(`/${m.name}`));
          if (module && !module.status) {
            module.status = "pending";
            // before load callback
            if (isFunction(beforeLoad)) {
              beforeLoad(module);
            }

            loadModule(module.url).then(({ type }) => {
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
        if (!this.$root.$_VUE_MODULE_REGISTER) {
          this.$root.$_VUE_MODULE_REGISTER = true;

          this.$_VUE_MODULE_REGISTER_unwatchFn = this.$watch(
            "$route",
            ({ path }) => {
              this.$_handleRouteChange(path);
            },
            { immediate: true },
          );
        }
      },

      beforeDestroy() {
        if (this.$_VUE_MODULE_REGISTER_unwatchFn instanceof Function) {
          this.$_VUE_MODULE_REGISTER_unwatchFn();
        }
      },
    };
  }
}
