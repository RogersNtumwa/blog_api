const express = require("express")
const router = express.Router();
const { check } = require("express-validator")

const { getPosts,
        addPost,
        getmyPosts,
        getPost,
        updatePost,
        deletePost,
        addlike,
        removelike,
        addComment,
        getUserPosts
} = require("../controllers/PostController");
const {protect} = require("../middleware/auth");
const { route } = require("./auth");

router.route("/")
    .get(getPosts)
    .post(protect, [
        check("title", "Title is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
    ], addPost)

router.get("/me", protect, getmyPosts);
router.get("/user/:id",protect, getUserPosts)

router.route("/:id")
    .get(getPost)
    .patch(protect, updatePost)
    .delete(protect, deletePost)

router.route("/like/:id").put(protect, addlike)
router.route("/unlike/:id").put(protect, removelike)
router.route("/comment/:id").put(protect, [
    check("text", "text is required").not().isEmpty(),
], addComment)


module.exports = router