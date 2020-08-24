const { Router } = require("express");
const Terminal = require("../models/Terminal");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/add", auth, async (req, res) => {
  try {
    const { title, desc } = req.body;

    const terminal = new Terminal({ title, desc, owner: req.user.userId });

    await terminal.save();

    res.status(201).json({ terminal });

  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так при добавлении" });
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    //TODO
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так при удалении" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const terminals = await Terminal.find({ owner: req.user.userId });
    res.json(terminals);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так при инициализации терминалов" });
  }
});

module.exports = router;
