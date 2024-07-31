import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal Server Error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic =
          "https://avatar.iran.liara.run/public/boy?username=" + username;
        const girlProfilePic =
          "https://avatar.iran.liara.run/public/girl?username=" + username;

        const newUser = new User({
          username,
          gender,
          profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
          name,
          password: hashedPassword,
        });

        await newUser.save();
        await context.login(newUser);

        return newUser;
      } catch (err) {
        console.log("Error in signup: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        if (!username || !password) {
          throw new Error("All fields are required");
        }

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        if (user) {
          await context.login(user);
        }

        return user;
      } catch (err) {
        console.log("Error in login: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();

        context.req.session.destroy((err) => {
          if (err) throw err;
        });

        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (err) {
        console.log("Error in logout: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  User: {
    transactions: async (parent, _, __) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transaction resolver: ", err);
        throw new Error(err.message);
      }
    },
  },
};

export default userResolver;
