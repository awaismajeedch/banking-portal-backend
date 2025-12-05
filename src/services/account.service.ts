import prisma from "../config/prisma";

function generateAccountNumber() {
  // Very simple example: 12-digit number as string
  const num = Math.floor(100000000000 + Math.random() * 900000000000);
  return String(num);
}

export class AccountService {
  async createAccount(userId: number, type: string) {
    // ensure type is one of allowed – you can expand later
    const allowedTypes = ["savings", "current"];
    if (!allowedTypes.includes(type)) {
      throw new Error("Invalid account type");
    }

    // basic uniqueness attempt for account number
    let accountNumber = generateAccountNumber();

    // optional: check if exists, retry a couple of times
    for (let i = 0; i < 3; i++) {
      const exists = await prisma.account.findUnique({
        where: { accountNumber },
      });
      if (!exists) break;
      accountNumber = generateAccountNumber();
    }

    const account = await prisma.account.create({
      data: {
        userId,
        accountNumber,
        balance: 0,
        type,
        status: "active",
      },
    });

    return account;
  }

  async getUserAccounts(userId: number) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAccountByIdForUser(accountId: number, userId: number, isAdmin: boolean) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (!isAdmin && account.userId !== userId) {
      throw new Error("You are not allowed to view this account");
    }

    return account;
  }

  async updateAccountStatus(accountId: number, status: "active" | "locked") {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: { status },
    });

    return account;
  }
}
