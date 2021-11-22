var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// packages/plugin-less/src/index.ts
__export(exports, {
  default: () => src_default
});
var import_promises = __toModule(require("fs/promises"));
var import_path = __toModule(require("path"));
var import_less = __toModule(require("less"));
function LessPlugin(options) {
  return {
    name: "plugin-less",
    setup: (build) => {
      build.onLoad({
        filter: /\.less$/,
        namespace: "file"
      }, async (args) => {
        const file = await import_promises.default.readFile(args.path, { encoding: "utf-8" });
        const info = import_path.default.parse(args.path);
        const res = await import_less.default.render(file, __spreadProps(__spreadValues({}, options), {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
