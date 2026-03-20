/* Used by Jest (babel-jest). Vite does not use this file. */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
    function importMetaShim() {
      const t = require("@babel/types");
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === "import" &&
              path.node.property.name === "meta"
            ) {
              path.replaceWith(
                t.memberExpression(
                  t.identifier("globalThis"),
                  t.identifier("__importMetaShim")
                )
              );
            }
          },
        },
      };
    },
  ],
};
