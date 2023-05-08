const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  _id: String,
  name: String,
  userId: Number,
});

const TagSchema = new mongoose.Schema({
  _id: String,
  name: String,
  userId: Number,
});

const BookmarkSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  pageUrl: { type: String, required: true },
  createdAt: { type: Date, default: () => Date.now() },
  previewImage: { type: String, required: true },
  domain: { type: String, required: true },
  userId: { type: Number, required: true },
  folderId: { type: String, required: false },
  tags: { type: [String], required: false, default: () => [] },
});

const UserSchema = new mongoose.Schema({
  _id: Number,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

const Folder = mongoose.model("Folder", FolderSchema);
const Tag = mongoose.model("Tag", TagSchema);
const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { Folder, Tag, Bookmark, User };
