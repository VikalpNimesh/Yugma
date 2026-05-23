const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withRozenite } = require('@rozenite/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enablePackageExports: false,
  },
};

module.exports = withRozenite(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    enabled: true,
  }
);
