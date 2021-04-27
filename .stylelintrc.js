module.exports = {
  plugins: [
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-order",
  ],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended",
    "stylelint-config-prettier",
    "stylelint-config-styled-components",
  ],
  rules: {
    "font-family-no-missing-generic-family-keyword": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "declaration-block-trailing-semicolon": "always",
    "selector-pseudo-element-colon-notation": "double",
    "order/properties-alphabetical-order": true,
    "plugin/declaration-block-no-ignored-properties": true,
    // for material UI CSS in JS object style
    "selector-type-case": null,
    "selector-type-no-unknown": null,
    "rule-empty-line-before": null,
    "max-nesting-depth": 2,
  },
  reportNeedlessDisables: true,
  reportInvalidScopeDisables: true,
};
