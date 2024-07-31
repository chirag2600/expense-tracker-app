import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error fetching transactions: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    transaction: async (_, { transactionId }, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }

        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error fetching the transaction: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }

        const { description, paymentType, category, amount, date, location } =
          input;

        const newTransaction = new Transaction({
          description,
          paymentType,
          category,
          amount,
          date,
          location,
          userId: context.getUser()._id,
        });

        newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error while creating transaction: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }

        const {
          transactionId,
          description,
          paymentType,
          category,
          amount,
          date,
          location,
        } = input;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
          transactionId,
          {
            description,
            paymentType,
            category,
            amount,
            date,
            location,
            userId: user._id,
          },
          { new: true }
        );

        return updatedTransaction;
      } catch (err) {
        console.error("Error while updating transaction: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const user = context.getUser();
        if (!user) {
          throw new Error("Unauthorized");
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );

        return deletedTransaction;
      } catch (err) {
        console.error("Error while deleting transaction: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId; // parent is the Transaction
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log("Error in transaction.user resolver: ", err);
        throw new Error(err.message);
      }
    },
  },
};

export default transactionResolver;
