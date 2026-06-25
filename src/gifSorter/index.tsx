import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [
  {
    find: "1TOSaJsWtnhe0",
    replace: {
      match: /data:\s*(\i)\s*===\s*(\i\.\i\.FAVORITES)\s*\?\s*(\i)\s*:\s*(\i)\s*,/,
      replacement: (_orig, resultType, favoritesConst, favArray, searchArray) =>
        `data: ${resultType} === ${favoritesConst} ? require("gifSorter_storage").filterByFolder(${favArray}) : ${searchArray},`
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  storage: {
    dependencies: []
  }
};
