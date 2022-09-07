const router = require("express").Router();
const { Comment } = require("../../models");

// create comment
router.post("/", async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const { post_id, post_text } = req.body;

    if (!user_id || !post_id || !post_text) {
      res.json({ message: "Insufficient Data" });
    }

    const newComment = await Comment.create({
      user_id,
      post_id,
      post_text,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete comment
router.delete("/:id", async (req, res) => {
  try {
    const deleteComment = await Comment.destroy({
      where: {
        id: req.params.post_id,
      },
    });
    if (!deleteComment) {
      res.status(400).json({ message: "No comment with the given id" });
      return;
    }
    res.json(deleteComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
