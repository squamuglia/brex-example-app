/** @type {import('next').NextConfig} */
const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config, _options) => {
    config.resolve.alias["@/*"] = path.join(__dirname, "@/*");
    return config;
  },
};
