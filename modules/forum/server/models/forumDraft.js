module.exports = (sequelize, DataTypes) => {
  const forumDraft = sequelize.define("forumDraft", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [3, 40],
    },
    content: {
      type: DataTypes.STRING,
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
  forumDraft.associate = (models) => {
    forumDraft.belongsTo(models.forumThread, {
      as: "drafts",
      foreignKey: "threadId",
    });
    forumDraft.belongsTo(models.user, {
      as: "author",
      foreignKey: "authorId",
    });
  };
  return forumDraft;
};
