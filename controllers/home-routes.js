const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();
router.get("/", async (req, res) => {
  await Post.findAll({
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
      {
        model: User,
        attributes: ["email"],
      },
    ],
  })
    .then((postData) => {
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  } else res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/post/:id", async (req, res) => {
  await Post.findOne(
    {
      where: {
        id: req.params.post_id,
      },
      attributes: ["post_id", "post_text", "post_title", "createdAt"],
      include: {
        model: User,
        attributes: ["email"],
      },
    },
    {
      model: User,
      attributes: ["email"],
    }
  )
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post with the given ID" });
        return;
      } else {
        const post = postData.get({ plain: true });
        console.log(post);
        res.render("single-post", { post, loggedIn: req.session.loggedIn });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/posts-comments", async (req, res) => {
  await Post.findOne({
    where: {
      id: req.params.post_id,
    },
    attributes: ["post_id", "post_text", "post_title", "createdAt"],
    include: [
      {
        model: Comment,
        attributes: ["comment_id", "comment_text", "post-id", "createdAt"],
        include: {
          model: User,
          attributes: ["email"],
        },
      },
      {
        model: User,
        attributes: ["email"],
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post with the given ID" });
        return;
      } else {
        const post = postData.get({ plain: true });
        res.render("post-comments", { post, loggedIn: req.session.loggedIn });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
