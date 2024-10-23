const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const route = express.Router();
const db = require("../db/database");

cloudinary.config({
  cloud_name: "dcilcqkiq",
  secure: true,
  api_key: "166412622424926",
  api_secret: "xcVwT6T_xgpnwhCvGz8dx4VmWpk", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: "./upload/",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});
const getImage = async (req, res) => {
  try {
    console.log(req.file);
    const { chat_id, user_id } = req.body;
    // const imgPath = req.file.path;
    // const buffer = await fs.readFile(imgPath);
    const [data] = await db("messages")
      .select("*")
      .where({ chat_id: chat_id, user_id: user_id });
    console.log(data.image);
    return res.json({ msg: data.image });
  } catch (e) {
    return res.status(500).json({ msg: `${e.code}` });
  }
};

const imagesApi = async (req, res) => {
  try {
    console.log(req.file);
    const { chat_id, user_id } = req.params;
    const imgPath = req.file.path;
    const buffer = await fs.readFile(imgPath);
    const [message] = await db("messages")
      .select("image_path")
      .where({ chat_id: chat_id, user_id: user_id });
    if (message.image_path) {
      const uploadedImage = await cloudinary.uploader.upload(
        message.image_path,
        {
          resource_type: "image",
          use_filename: true,
          public_id: req.file.originalname,
          unique_filename: false,
        }
      );
      const data = await db("messages")
        .update({
          image: buffer,
          image_path: imgPath,
        })
        .where({ chat_id: chat_id, user_id: user_id });

      return res.json({ msg1: data, msg2: uploadedImage });
    } else {
      return res.status(400).json({ msg: "No image found in message" });
    }
  } catch (e) {
    return res.status(500).json({ msg: `${e.code}` });
  }
};

const messagesApi = async (req, res) => {
  try {
    const { chat_id, user_id, content } = req.body;
    const data = await db("messages").insert({
      chat_id: chat_id,
      user_id: user_id,
      content: content,
    });
    return res.json({ msg: data, path: req.file.filename });
  } catch (e) {
    res.status(500).json({ msg: `${e.code}` });
  }
  if (e.code === "23503") {
    return res.status(400).json({ error: "Invalid chat_id or user_id" });
  }
};

const joiningMessages = async (req, res) => {
  const chat_id = req.body.chat_id;
  const user_id = req.body.user_id;
  const data = await db("messages")
    .join("users", "messages.user_id", "users.id")
    .join("chats", "messages.chat_id", "chats.id")
    .select(
      "messages.id as message_id",
      "users.name as sender_name",
      "chats.name as chat_name",
      "messages.content",
      "messages.created_at"
    )
    .where("messages.chat_id", chat_id)
    .andWhere("messages.user_id", user_id);
  return res.json({ msg: data });
};

route.get("/joiningMessages", joiningMessages);
route.get("/getImage", getImage);

route.post("/imagesApi/:chat_id/:user_id", upload.single("image"), imagesApi);

route.post("/messagesApi", messagesApi);
module.exports = route;
