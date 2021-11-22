// packages/plugin-globals/src/index.ts
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
export {
  src_default as default
};
