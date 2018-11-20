import { RouteConfig } from "vue-router";

interface ContainerHelperOptions {
  name?: string;
  poolTarget?: object;
  poolName?: string;
  store?: any;
}

export declare class ContainerHelper {
  constructor(options: ContainerHelperOptions);

  mountSharedMethods(methodsMap: any): void;
  mountRoutes(routes: RouteConfig[]): void;
  getRoutes(): RouteConfig[];
  mountStoreInstance(storeInstance: any): void;
  registerModule(storeModule: any): void;
}

export default ContainerHelper;
