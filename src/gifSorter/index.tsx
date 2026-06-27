import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [
  {
    find: "1TOSaJsWtnhe0",
    replace: [
      {
        match: /data:\s*(\i)\s*===\s*(\i\.\i\.FAVORITES)\s*\?\s*(\i)\s*:\s*(\i)\s*,/,
        replacement: (_orig, resultType, favoritesConst, favArray, searchArray) =>
          `data: ${resultType} === ${favoritesConst} ? require("gifSorter_storage").filterByFolder(${favArray}) : ${searchArray},`
      },
      {
        match: /return null==(\i)\?/,
        replacement: (_orig, d) => `return require("gifSorter_folderBar").wrapContent(this, null==${d}?`
      },
      {
        match: /selectedGIF:this\.props\.selectedGIF\}\)/,
        replacement: () => `selectedGIF:this.props.selectedGIF}))`
      }
    ]
  },
  {
    find: "handleClickItem",
    replace: [
      {
        match: /renderExtras:\s*\(\)\s*=>\s*\(0,(\i)\.jsx\)\((\i)\.(\i),\{className:(\i)\.(\i),\.\.\.(\i)\}\)/,
        replacement: (_orig, jsx, componentObj, componentProp, styleObj, styleProp, props) =>
          `renderExtras: () => require("gifSorter_folderBar").renderGifExtras(${props}, (0,${jsx}.jsx)(${componentObj}.${componentProp}, {className: ${styleObj}.${styleProp}, ...${props}}))`
      }
    ]
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  storage: {
    dependencies: [],
    entrypoint: true
  },
  styles: {
    dependencies: [],
    entrypoint: true
  },
  folderBar: {
    dependencies: [{ id: "react" }, { ext: "gifSorter", id: "storage" }, { ext: "gifSorter", id: "styles" }],
    entrypoint: true
  }
};
