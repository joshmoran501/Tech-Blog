const { User, Post, Comment } = require("../models");
const router = require("express").Router();
const sequelize = require("../config/connection");
const withAuth = require("../utils/auth");

// find all posts by logged in user
router.get("/", withAuth, async (req, res) => {
  await Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["post_id", "post_title", "post_text", "createdAt"],
    include: [
      {
        model: Comment,
        attributes: ["comment_id", "comment_text", "post_id", "createdAt"],
        include: {
          model: User,
          attributes: ["email"],
        },
      },
    ],
  })
    .then((postData) => {
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id");
