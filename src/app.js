const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = req.body;

  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = data;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(500).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Please provide a valid email address!");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login successful!!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// Get user by email - GET /user - get the user from the database by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching users " + err.message);
  }
});

// Get user by Id - GET /userId - get the user from the database by id
app.get("/userId", async (req, res) => {
  const userId = req.body.id;
  try {
    const users = await User.find({ _id: userId });

    if (users.length === 0) {
      res.status(404).send("User Id not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error fetching users " + err.message);
  }
});

// Delete user - DELETE /user - delete the user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Failed to delete user " + err.message);
  }
});

// Update user by Id - PATCH /userId - update the user in the database by id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  console.log(data, userId);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log("User before update: ", user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error fetching users " + err.message);
  }
});

// Update user by email - PATCH /userId - update the user in the database by email
app.patch("/userEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error fetching users " + err.message);
  }
});

// Feed Api - GET /feed - get all the users from the datatbase
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while fetching users " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
    console.error(err);
  });
