import { RouteConfig } from "vue-router";

interface CreateLoaderOptions {
  global?: any;
  poolName?: string;
  cache?: boolean;
  store?: any;
  router?: any;
}

export declare class CreateLoader {
  constructor(options: CreateLoaderOptions);
}

interface CreateRegisterOptions {
  name: string;
  global?: any;
  poolName?: string;
  log?: boolean;
}

export declare class CreateRegister {
  constructor(options: CreateRegisterOptions);

  registerModule(store: any): CreateRegister;
  addRoutes(routes: RouteConfig[]): CreateRegister;
}

interface CreateLoaderMixinOptions {
  modules: {
    name: string;
    url: string;
  }[];
  global?: any;
  poolName?: string;
  cache?: boolean;
  store?: any;
  router?: any;
}

export declare class CreateLoaderMixin {
  constructor(options: CreateLoaderMixinOptions);
}

declare const _default: {
  CreateLoader: typeof CreateLoader;
  CreateRegister: typeof CreateRegister;
  CreateLoaderMixin: typeof CreateLoaderMixin;
};

export default _default;
