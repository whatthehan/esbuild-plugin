var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// packages/plugin-globals/src/index.ts
__export(exports, {
  default: () => src_default
});
function GlobalsPlugin(options) {
  return {
    name: "plugin-globals",
    setup: (build) => {
      const regexp = Object.keys(options).map((key) => `^${key}$`).join("|");
      build.onLoad({
        filter: new RegExp(regexp),
        namespace: "file"
      }, (args) => {
        const value = options[args.path];
        if (!value) {
          throw new Error(`unknow global config key: ${args.path}`);
        }
        return {
          contents: `export default window['${value}']`,
          loader: "js"
        };
      });
    }
  };
}
var src_default = GlobalsPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
