const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const whitelist = ["http://localhost:5174"];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow local dev and hosted domain, deny others
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false, //true for hosting
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));

let verificationCodes = {};

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // Your email password
  },
  debug: true
});

// Signup Route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.checkEmailExists(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query error" });

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Профил с този имейл вече съществува." });
    }

    // Генерира код за потвърждение
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Съхранява временно кода
    verificationCodes[email] = {
      code: verificationCode,
      firstName,
      lastName,
      password, // Store the password temporarily
      expiresAt: Date.now() + 15 * 60 * 1000 // Задава 15 минути валидност
    };

    // Изпраща код за потвърждение по имейл
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Шестцифрен код за потвърждение от ИМЕ_НА_ПРОЕКТА",
      html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <h2>Благодарим Ви за регистрацията в <span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span>ИМЕ_НА_ПРОЕКТА<span style="color: rgb(178, 50, 0); font-weight: 600;">🕮</span></h2>
          <hr style="border: 0.5px solid rgb(178, 50, 0); width: 18%; margin-top: 6%; margin-bottom: 4%"></hr>
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл! :(" });
      res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
    });
  });
});

// Resend Route
app.post("/resend", (req, res) => {
  const { email } = req.body;

  // Генерира код за потвърждение
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  // Съхранява кода временно
  verificationCodes[email] = {
    ...verificationCodes[email],
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000 // Задава 15 минути валидност
  };

  // Изпраща нов код за потвърждение по имейл
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Нов шестцифрен код за потвърждение от ИМЕ_НА_ПРОЕКТА",
    html: `
      <div style="text-align: center; background-color: rgba(244, 211, 139, 0.5); margin: 2% 3%; padding: 3% 1%; border: 4px dotted rgb(178, 50, 0); border-radius: 20px">
        <p>Вашият шестцифрен код е <strong style="font-size: 20px; color: rgb(178, 50, 0)">${verificationCode}</strong>.</p>
      </div>
      <div>
        <p style="border-radius: 5px; background-color: rgba(178, 50, 0, 0.2); text-align: center; font-size: 13px; margin: 5% 25% 0% 25%">Не сте поискали код? Игнорирайте този имейл.</p>
      </div>`
  };

  console.log(verificationCodes[email]);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return res
        .status(500)
        .json({ error: "Не успяхме да изпратим имейл! :(" });
    res.json({ message: "Кодът за потвърждение е изпратен на вашия имейл!" });
  });
});

// Verification Route
app.post("/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  const storedData = verificationCodes[email];
  if (!storedData) {
    return res
      .status(400)
      .json({ error: "Не е намерен код за потвърждение за този имейл." });
  }

  if (Date.now() > storedData.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: "Кодът за потвърждение е изтекъл." });
  }

  if (storedData.code !== verificationCode) {
    return res.status(400).json({ error: "Невалиден код за потвърждение." });
  }

  // Proceed with user registration
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(storedData.password, salt);

  db.createUser(
    storedData.firstName,
    storedData.lastName,
    email,
    hashedPassword,
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });

      // Изтрива кода след регистрация
      delete verificationCodes[email];
      res.json({ message: "Успешно регистриран профил!" });
    }
  );
});

// Sign in Route
app.post("/signin", (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "Въведената парола е грешна или непълна!" });

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "2h"
    });
    res.json({ message: "Успешно влизане!", token });
  });
});

// Password Reset Request Route
app.post("/password-reset-request", (req, res) => {
  const { email } = req.body;

  db.findUserByEmail(email, (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(400)
        .json({ error: "Не съществува потребител с този имейл адрес!" });

    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "15m"
    });

    // Create a reset link
    const resetLink = `http://localhost:5174/resetpassword/resetcover/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Промяна на паролата за ИМЕ_НА_ПРОЕКТА",
      html: `<p>Натиснете <a href="${resetLink}">тук</a>, за да промените паролата си.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не успяхме да изпратим имейл :(" });
      res.json({
        message: "Заявката за промяна на паролата е изпратена на вашия имейл!"
      });
    });
  });
});

// Password Reset Route
app.post("/password-reset", (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid or expired token" });

    const userId = decoded.id;

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.updateUserPassword(userId, hashedPassword, (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Успешно нулиране на паролата!" });
    });
  });
});

// Token Validation Route
app.post("/token-validation", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true });
  });
});

// Get User Data Route
app.get("/user-data", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const userId = decoded.id;

    db.getUserById(userId, (err, results) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: "Не съществува потребител с този имейл адрес!" });

      const user = results[0];
      res.json(user);
    });
  });
});

// Save User Preferences Route
app.post("/save-user-preferences", (req, res) => {
  const {
    token,
    preferred_genres_en,
    preferred_genres_bg,
    mood,
    timeAvailability,
    preferred_type,
    preferred_actors,
    preferred_directors,
    preferred_countries,
    preferred_pacing,
    preferred_depth,
    preferred_target_group,
    interests,
    date
  } = req.body;

  // Verify the token to get the user ID
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.id;

    console.log(
      "data: ",
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date
    );
    // Save user preferences to the database
    db.saveUserPreferences(
      userId,
      preferred_genres_en,
      preferred_genres_bg,
      mood,
      timeAvailability,
      preferred_type,
      preferred_actors,
      preferred_directors,
      preferred_countries,
      preferred_pacing,
      preferred_depth,
      preferred_target_group,
      interests,
      date,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "User preferences saved successfully!" });
      }
    );
  });
});

// Save Recommendation
app.post("/save-recommendation", (req, res) => {
  const {
    token,
    imdbID,
    title_en,
    title_bg,
    genre_en,
    genre_bg,
    reason,
    description,
    year,
    rated,
    released,
    runtime,
    director,
    writer,
    actors,
    plot,
    language,
    country,
    awards,
    poster,
    ratings,
    metascore,
    imdbRating,
    imdbVotes,
    type,
    DVD,
    boxOffice,
    production,
    website,
    totalSeasons,
    date
  } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const userId = decoded.id;
    db.saveRecommendation(
      userId,
      imdbID,
      title_en,
      title_bg,
      genre_en,
      genre_bg,
      reason,
      description,
      year,
      rated,
      released,
      runtime,
      director,
      writer,
      actors,
      plot,
      language,
      country,
      awards,
      poster,
      ratings,
      metascore,
      imdbRating,
      imdbVotes,
      type,
      DVD,
      boxOffice,
      production,
      website,
      totalSeasons,
      date,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Recommendation added successfully!" });
      }
    );
  });
});

// Get Most Recommended Movies/Series
app.get("/stats/platform/top-recommendations", (req, res) => {
  const limit = 10;

  db.getTopRecommendations(limit, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching top recommendations" });
    }
    res.json({ topRecs: results });
  });
});

// Вземане на данни за най-препоръчвани жанрове в платформата
app.get("/stats/platform/top-genres", async (req, res) => {
  const limit = 10;

  db.getTopGenres(limit, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top genres" });
    }
    res.json({ topRecs: results });
  });
});

// Вземане на данни за най-препоръчвани актьори в платформата
app.get("/stats/platform/top-actors", async (req, res) => {
  const limit = 10;

  db.getTopActors(limit, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top actors" });
    }
    res.json({ topRecs: results });
  });
});

// Вземане на данни за най-препоръчвани филмови режисьори в платформата
app.get("/stats/platform/top-directors", async (req, res) => {
  const limit = 10;

  db.getTopDirectors(limit, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top directors" });
    }
    res.json({ topRecs: results });
  });
});

// Вземане на данни за най-препоръчвани сценаристи в платформата
app.get("/stats/platform/top-writers", async (req, res) => {
  const limit = 10;

  db.getTopWriters(limit, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching top writers" });
    }
    res.json({ topRecs: results });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
