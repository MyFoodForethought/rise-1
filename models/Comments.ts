// models/Comment.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../src/config/db';
import Post from './Posts';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public postId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  }
);

Comment.belongsTo(Post, { foreignKey: 'postId' });

export default Comment;
