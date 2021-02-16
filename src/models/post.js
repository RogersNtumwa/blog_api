const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default:"no image"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{
        user:{type:mongoose.Schema.Types.ObjectId, ref: "User"}
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        date: {
            type: Date, default: Date.now()
        }
    }],
    date: {
        type: Date, default: Date.now()
    }
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;