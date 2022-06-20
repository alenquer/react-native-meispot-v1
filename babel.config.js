module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['module:metro-react-native-babel-preset']],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          allowUndefined: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
