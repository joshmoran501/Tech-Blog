const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

// get all posts
router.get("/", async (req, res) => {
  await Post.findAll({
    attributes: ["post_id", "post_title", "post_text", "createdAt"],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["email"],
      },
      {
        model: Comment,
        attributes: ["comment_id", "comment_text", "user_id", "createdAt"],
        include: {
          model: User,
          attributes: ["email"],
        },
      },
    ],
  })
    .then((postData) => res.json(postData.reverse()))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one post
router.get("/:id", async (req, res) => {
  await Post.findOne({
    where: {
      id: req.params.post_id,
    },
    attributes: ["post_id", "post_title", "post_text", "createdAt"],
    include: [
      {
        model: User,
        attributes: ["email"],
      },
      {
        model: Comment,
        attributes: ["comment_id", "comment_text", "user_id", "createdAt"],
        include: {
          model: User,
          attributes: ["email"],
        },
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post found with the given ID" });
        return;
      } else {
        res.json(postData);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create post
router.post("/", withAuth, async (req, res) => {
  await Post.create({
    post_title: req.body.post_title,
    post_text: req.body.post_text,
    user_id: req.session.user_id,
  })
    .then((postData) => {
      res.json(postData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// edit post
router.put("/:id", withAuth, async (req, res) => {
  await Post.update(
    {
      post_title: req.body.post_title,
      post_text: req.body.post_text,
    },
    {
      where: {
        id: req.params.post_id,
      },
    }
  )
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post found with the given ID" });
        return;
      } else {
        res.json(postData);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete post
router.delete("/:id", withAuth, async (req, res) => {
  await Post.destroy({
    where: {
      id: req.params.post_id,
    },
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post found with the given ID" });
        return;
      } else {
        res.json(postData);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
