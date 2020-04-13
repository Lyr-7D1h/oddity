module.exports = (sequelize, DataTypes) => {
  const forumPost = sequelize.define("forumPost", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: [3, 40],
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      len: [3, 5000],
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    threadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  forumPost.associate = (models) => {
    forumPost.belongsTo(models.forumThread, {
      as: "posts",
      foreignKey: "threadId",
    });
    forumPost.belongsTo(models.user, {
      as: "author",
      foreignKey: "authorId",
    });
  };
  return forumPost;
};
