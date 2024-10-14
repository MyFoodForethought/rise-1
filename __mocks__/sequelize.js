const SequelizeMock = jest.createMockFromModule('sequelize');

SequelizeMock.Model = class {
  static init() {}
  static associate() {}
  static hasMany() {}
  static belongsTo() {}
};

module.exports = SequelizeMock;