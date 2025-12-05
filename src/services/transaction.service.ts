import prisma from "../config/prisma";

export class TransactionService {
  async deposit(userId: number, accountId: number, amount: number, reference?: string) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");

    return await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!account) throw new Error("Account not found");
      if (account.userId !== userId) throw new Error("You are not allowed to use this account");
      if (account.status !== "active") throw new Error("Account is not active");
      const newBalance = account.balance.toNumber() + amount;

      const updated = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: newBalance,
        },
      });

      const txn = await tx.transaction.create({
        data: {
          accountId: accountId,
          amount,
          type: "deposit",
          reference: reference ?? null,
          balanceAfter: updated.balance,
        },
      });

      return { account: updated, transaction: txn };
    });
  }

  async withdraw(userId: number, accountId: number, amount: number, reference?: string) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");

    return await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!account) throw new Error("Account not found");
      if (account.userId !== userId) throw new Error("You are not allowed to use this account");
      if (account.status !== "active") throw new Error("Account is not active");
      if (account.balance.toNumber() < amount) throw new Error("Insufficient funds");
      const newBalance = account.balance.toNumber() - amount;

      const updated = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: newBalance,
        },
      });

      const txn = await tx.transaction.create({
        data: {
          accountId: accountId,
          amount,
          type: "withdrawal",
          reference: reference ?? null,
          balanceAfter: updated.balance,
        },
      });

      return { account: updated, transaction: txn };
    });
  }

  async transfer(userId: number, fromAccountId: number, toAccountId: number, amount: number, reference?: string) {
    if (amount <= 0) throw new Error("Amount must be greater than zero");
    if (fromAccountId === toAccountId) throw new Error("Cannot transfer to the same account");

    return await prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findUnique({ where: { id: fromAccountId } });
      const toAccount = await tx.account.findUnique({ where: { id: toAccountId } });

      if (!fromAccount || !toAccount) throw new Error("One or both accounts not found");
      if (fromAccount.userId !== userId) throw new Error("You are not allowed to use this source account");
      if (fromAccount.status !== "active" || toAccount.status !== "active")
        throw new Error("Both accounts must be active");
      if (fromAccount.balance.toNumber() < amount) throw new Error("Insufficient funds");
      const updatedFromBalance = fromAccount.balance.toNumber() - amount;
      const updatedToBalance = toAccount.balance.toNumber() + amount;

      const updatedFrom = await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: updatedFromBalance,
        },
      });

      const updatedTo = await tx.account.update({
        where: { id: toAccountId },
        data: {
          balance: updatedToBalance,
        },
      });

      const withdrawTxn = await tx.transaction.create({
        data: {
          accountId: fromAccountId,
          amount,
          type: "transfer",
          reference: reference ?? `Transfer to account ${toAccount.accountNumber}`,
          balanceAfter: updatedFrom.balance,
        },
      });

      const depositTxn = await tx.transaction.create({
        data: {
          accountId: toAccountId,
          amount,
          type: "transfer",
          reference: reference ?? `Transfer from account ${fromAccount.accountNumber}`,
          balanceAfter: updatedTo.balance,
        },
      });

      const transferLog = await tx.transferLog.create({
        data: {
          fromAccount: fromAccount.accountNumber,
          toAccount: toAccount.accountNumber,
          amount,
          reference: reference ?? null,
        },
      });

      return {
        fromAccount: updatedFrom,
        toAccount: updatedTo,
        transactions: {
          from: withdrawTxn,
          to: depositTxn,
        },
        transferLog,
      };
    });
  }

  async getTransactionsForAccount(userId: number, accountId: number) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error("Account not found");
    if (account.userId !== userId) throw new Error("You are not allowed to view this account");

    const txns = await prisma.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    return txns;
  }
}
