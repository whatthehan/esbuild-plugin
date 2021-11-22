var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// packages/plugin-less/src/index.ts
import fs from "fs/promises";
import path from "path";
import less from "less";
function LessPlugin(options) {
  return {
    name: "plugin-less",
    setup: (build) => {
      build.onLoad({
        filter: /\.less$/,
        namespace: "file"
      }, async (args) => {
        const file = await fs.readFile(args.path, { encoding: "utf-8" });
        const info = path.parse(args.path);
        const res = await less.render(file, __spreadProps(__spreadValues({}, options), {
          filename: info.name,
          paths: [...options.paths || [], info.dir],
          rootpath: info.dir
        }));
        return {
          contents: res.css,
          loader: "css"
        };
      });
    }
  };
}
var src_default = LessPlugin;
export {
  src_default as default
};
