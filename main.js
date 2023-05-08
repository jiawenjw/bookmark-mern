const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Guid } = require("js-guid");
const { User, Folder, Tag, Bookmark } = require("./database/model");
const { protect } = require("./middleware/authMiddleware");
const Url = require("url-parse");

const cheerio = require("cheerio");
const Jimp = require("jimp");

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const comparePassword = async (password, acutalPassword) => {
  try {
    const success = await bcrypt.compare(password, acutalPassword);
    return !!success;
  } catch (e) {
    return false;
  }
};

require("dotenv").config();
const db_url = process.env.DB_URL;
const port = process.env.PORT;
const frontend_path = path.resolve(process.env.FRONTEND_PATH);

async function startup(db_url, port, frontend_path) {
  // Suppress the mongosh warning.
  mongoose.set("strictQuery", false);
  // Do not need to try...catch because exceptions from awaited async calls will be propagated to this functon('startup').
  await mongoose.connect(db_url);
  console.log("Connected to the database.");

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  //  parses incoming JSON requests and puts the parsed data in req.body.
  app.use(express.json());

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && (await comparePassword(password, user.password))) {
        return res.status(200).json({
          token: generateToken({ _id: user._id, username: user.username }),
        });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } catch (e) {
      res.status(500).json({ message: "error login" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "please fill in all fields" });
      }

      // Check if user exists
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const numberOfUsers = await User.find({}).count();
      const user = await User.create({
        _id: numberOfUsers + 1,
        username: username,
        email: email,
        password: hashedPassword,
      });
      // if user is successfully created, send the token to the user
      if (user) {
        return res.status(201).json({});
      } else {
        return res.status(400).json({ message: "Invalid user data" });
      }
    } catch (e) {
      return res.status(500).json({ message: "Registration fail" });
    }
  });

  app.get("/api/folder-list", protect, async (req, res) => {
    try {
      const user = req.user;
      const folders = await Folder.find({ userId: user._id });
      return res.status(200).json(folders);
    } catch (e) {
      return res.status(500).json({ message: "Failed to fetch folders" });
    }
  });

  app.post("/api/folder-create", protect, async (req, res) => {
    try {
      const user = req.user;
      const folder = await Folder.create({
        _id: Guid.newGuid(),
        userId: user._id,
        name: req.body.name,
      });
      return res.status(200).json(folder);
    } catch (e) {
      return res.status(500).json({ message: "Failed to create folder" });
    }
  });

  app.delete("/api/folder-delete/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      await Folder.findOneAndDelete({
        _id: id,
      });
      return res.status(200).json({});
    } catch (e) {
      return res.status(500).json({ message: "Failed to delete folder" });
    }
  });

  app.post("/api/folder-update/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const folder = await Folder.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: { name: req.body.name } }
      );
      return res.status(200).json(folder);
    } catch (e) {
      e;
      return res.status(500).json({ message: "Failed to update folder" });
    }
  });

  app.get("/api/folder-detail/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const folder = await Folder.findOne({ _id: id });
      const bookmarks = await Bookmark.find({ folderId: id }, { _id: 1 });
      return res.status(200).json({
        bookmarks: bookmarks.map((x) => x._id),
        folder_name: folder.name,
      });
    } catch (e) {
      return res.status(500).json({ message: "Failed to get folder details" });
    }
  });

  app.get("/api/tag-list", protect, async (req, res) => {
    try {
      const user = req.user;
      const tags = await Tag.find({ userId: user._id });
      return res.status(200).json(tags);
    } catch (e) {
      return res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tag-create", protect, async (req, res) => {
    try {
      const user = req.user;
      const tag = await Tag.create({
        _id: Guid.newGuid(),
        userId: user._id,
        name: req.body.name,
      });
      return res.status(200).json(tag);
    } catch (e) {
      return res.status(500).json({ message: "Failed to create tag" });
    }
  });

  app.delete("/api/tag-delete/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      await Tag.findOneAndDelete({
        _id: id,
      });
      return res.status(200).json({});
    } catch (e) {
      return res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  app.post("/api/tag-update/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const tag = await Tag.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: { name: req.body.name } }
      );
      return res.status(200).json(tag);
    } catch (e) {
      e;
      return res.status(500).json({ message: "Failed to update tag" });
    }
  });

  app.get("/api/bookmark-list", protect, async (req, res) => {
    try {
      const user = req.user;
      const bookmarks = await Bookmark.find({ userId: user._id });
      return res.status(200).json(bookmarks);
    } catch (e) {
      return res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.delete("/api/bookmark-delete/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      await Bookmark.findOneAndDelete({
        _id: id,
      });
      return res.status(200).json({});
    } catch (e) {
      return res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  app.post("/api/bookmark-update/:id", protect, async (req, res) => {
    try {
      const id = req.params.id;
      const bookmark = await Bookmark.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            folderId: req.body.folderId,
            tags: req.body.tags,
          },
        }
      );
      return res.status(200).json(bookmark);
    } catch (e) {
      return res.status(500).json({ message: "Failed to update bookmark" });
    }
  });

  app.post("/api/bookmark-create", protect, async (req, res) => {
    try {
      const user = req.user;
      const { pageUrl, folderId, tags } = req.body;

      const generatePreview = async (pageUrl) => {
        const headers = {
          "Access-Control-Allow-Origin": "http://localhost:8888",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "3600",
          "User-Agent":
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0",
        };

        const res = await axios.get(pageUrl, {
          headers: headers,
        });

        const html = cheerio.load(res.data);
        const getDomain = (html) => {
          let domain = html('link[rel="canonical"]')?.first()?.attr("href");
          if (!domain) {
            domain = html('meta[property="og:url"]')?.first()?.attr("content");
          }
          if (!domain) {
            domain = null;
          }
          return domain;
        };

        const getTitle = (html) => {
          let title = html("title")?.text();
          if (!title) {
            title = html('meta[property="og:title"]')?.first()?.attr("content");
          }
          if (!title) {
            title = html('meta[property="twitter:title"]')
              ?.first()
              ?.attr("content");
          }
          if (!title) {
            title = html("h1")?.first()?.text();
          }
          if (!title) {
            title = null;
          }
          return title;
        };

        const getDesc = (html) => {
          let desc = html('meta[property="og:description"]')
            ?.first()
            ?.attr("content");
          if (!desc) {
            desc = html('meta[property="twitter:description"]')
              ?.first()
              ?.attr("content");
          }
          if (!desc) {
            desc = html('meta[property="description"]')
              ?.first()
              ?.attr("content");
          }
          if (!desc) {
            const ps = html("p");
            const maximumLength = 1;
            for (let p of ps) {
              const pText = p.text();
              if (pText.length > maximumLength) {
                maximumLength = pText.length;
                desc = pText;
              }
            }
          }
          if (!desc) {
            desc = null;
          }
          return desc;
        };

        const getImage = async (html, pageUrl) => {
          let image = html('meta[property="og:image"]')
            ?.first()
            ?.attr("content");
          if (!image) {
            image = html('link[rel="image_src"]')?.first()?.attr("href");
          }
          if (!image) {
            const imgs = html("img");
            const largest_area = 0;
            for (let img of imgs) {
              let image_raw = null;
              if (img.attr("src") && img.attr("src").startsWith("https://")) {
                image_raw = img.attr("src");
              } else if (
                img.attr("data-src") &&
                img.attr("data-src").startsWith("https://")
              ) {
                image_raw = img.attr("data-src");
              } else if (
                img.attr("src") &&
                (img.attr("src").endsWith(".jpg") ||
                  img.attr("src").endsWith(".png"))
              ) {
                image_raw = path.join(pageUrl, image.attr("src"));
              }

              if (
                image_raw &&
                (image_raw.startsWith("https://") ||
                  image_raw.startsWith("http://"))
              ) {
                try {
                  const headers = {
                    "User-Agent":
                      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0",
                  };
                  const imgRes = await axios.get(image_raw, {
                    headers: headers,
                    responseType: "arraybuffer",
                  });
                  const buffer = Buffer.from(imgRes.data, "binary").toString(
                    "base64"
                  );
                  const jimp = await Jimp.read(buffer, "base64");
                  const width = jimp.bitmap.width;
                  const height = jimp.bitmap.height;
                  const area = width * height;
                  if (area > largest_area) {
                    largest_area = area;
                    image = image_raw;
                  }
                } catch (e) {}
              }
            }
          }
          if (!image) {
            image = null;
          }
          return image;
        };

        let domainName = getDomain(html);
        if (!domainName) {
          domainName = pageUrl;
        }
        const domainUrl = new Url(domainName);
        return {
          title: getTitle(html),
          description: getDesc(html),
          pageUrl: pageUrl,
          previewImage: await getImage(html, pageUrl),
          domain: domainUrl.origin,
        };
      };

      const bookmark_data = await generatePreview(pageUrl);
      bookmark_data.userId = user._id;
      if (folderId) {
        bookmark_data.folderId = folderId;
      }
      if (tags) {
        bookmark_data.tags = tags;
      }
      const bookmark = await Bookmark.create({
        _id: Guid.newGuid(),
        ...bookmark_data,
      });
      return res.status(200).json(bookmark);
    } catch (e) {
      return res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.use(express.static(frontend_path, { index: false, redirect: false }));

  // Catch all case returns index.html.
  app.get("*", (req, res) => {
    console.log(`Got request ${req.path}.`);
    const filename = path.join(frontend_path, "index.html");
    res.sendFile(filename);
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

startup(db_url, port, frontend_path);
