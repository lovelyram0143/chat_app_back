const usermodel = require("../models/usermodel");
const asyncHandler = require("express-async-handler");

/* The `createUser` function is responsible for creating a new user in the system. Here is a breakdown
of what the function does: */
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const user = await usermodel.findOne({ email: email });
  const user_name = await usermodel.findOne({ username: username });
  if (user) {
    throw new Error(
      `user already exists ${user.email} and ${user_name.username}`
    );
  }

  if (user_name || user) {
    if (user_name) {
      throw new Error(`user already exists ${user_name.username}`);
    } else {
      throw new Error(`user already exists ${user.email}`);
    }
  } else {
    const new_user = await usermodel.create(req.body);

    console.log(new_user);

    res.json({ status: 200, data: new_user });
  }
});

/* The `update_user` function is responsible for updating a user's information in the database based on
the provided user ID. Here is a breakdown of what the function does: */
const update_user = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validate_mongoos_id(id);
  try {
    const UpdateUser = await usermodel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.json({ UpdateUser });
  } catch (error) {
    throw new Error({ status: 400, message: error });
  }
});

/* The `forgot_password` function is responsible for generating a password reset token for a user and
saving it in the database. Here is a breakdown of what the function does: */
const forgot_password = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await usermodel.findOne({ email: email });
  if (!user) throw new Error("User not found");
  const token = await user.createPasswordRestToken();
  await user.save();
  const resetUrl = `http://localhost:3001/api/user/reset-password-token/${token}`;
  const html = `You password reset link is: <a href='${resetUrl}'>Click here</a>`;
  const data = {
    to: user.email,
    subject: "Password reset token",
    message: "Your password reset token",
    html: html,
  };
  try {
    console.log(data);
    // sendEmail(data);
    res.json({ message: "Email sent", token: token });
  } catch (error) {
    throw new Error(error);
  }
});

/* The `reset_password` function is responsible for updating a user's password based on the provided
  password reset token. Here is a breakdown of what the function does: */
const reset_password = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await usermodel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new Error("Token is invalid or has expired, please try again");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successfully", user: user });
});

module.exports = { createUser, update_user, reset_password, forgot_password };
