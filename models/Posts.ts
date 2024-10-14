// models/Post.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../src/config/db'
import User from './User';

class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
  }
);

Post.belongsTo(User, { foreignKey: 'userId' });

export default Post;
