const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();

// /api/auth
router.post(
  "/signup",
  [
    check("username").exists(),
    check("password", "Минимальная длина пароля 8")
      .isLength({ min: 8 })
      .matches(/[0-9][A-z]/)
      .withMessage("Должен содержать хотябы 1 число")
      .exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные"
        });
      }

      const { username, password } = req.body;

      const candidate = await User.findOne({ username });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь существует" });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({ username, password: hashPassword });

      await user.save();

      res.status(201).json({ mesaage: "Пользователь создан" });
    } catch (e) {
      res.status(500).json({ mesaage: e.message });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("password", "Минимальная длина пароля 8")
      .isLength({ min: 8 })
      .matches(/\d/)
      .withMessage("Должен содержать хотябы 1 число")
      .exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные"
        });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h"
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ mesaage: "Что-то пошло не так" });
    }
  }
);

module.exports = router;
