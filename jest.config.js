module.exports = {
  preset: "react-native",
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|@react-navigation)',
    '\\.(bmp|gif|jpg|jpeg|png|svg|ttf|otf)$',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
