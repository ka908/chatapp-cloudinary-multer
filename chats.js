const express = require("express");
const route = express.Router();
const db = require("../db/database");

const chatApi = async (req, res) => {
  try {
    const { name } = req.body;
    const chatData = await db("chats").insert({
      name: name,
    });
    return res.json({ msg: chatData });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};
route.post("/chatApi", chatApi);
module.exports = route;
