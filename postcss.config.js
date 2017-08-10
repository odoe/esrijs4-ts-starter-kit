"use strict";

module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  plugins: {
    "postcss-import": {},
    "postcss-cssnext": {},
    "css-mqpacker": {},
    "cssnano": ctx.env === "production" ? {} : false
  }
});
