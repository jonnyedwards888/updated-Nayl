const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'lottie' to the list of asset extensions
config.resolver.assetExts.push('lottie');

module.exports = config;
