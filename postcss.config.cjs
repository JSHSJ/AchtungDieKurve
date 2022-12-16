const postcssPresetEnv = require('postcss-preset-env');
// import postcssPresetEnv from 'postcss-preset-env';

module.exports = {
    plugins: [postcssPresetEnv({ stage: 1 })],
};
