import prisma from "../config/prisma";

export class DashboardService {
  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            accountNumber: true,
            balance: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getSummary(userId: number) {
    // Get all accounts for user
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        balance: true,
      },
    });

    const accountCount = accounts.length;

    const totalBalance = accounts.reduce((sum, acc) => {
      return sum + Number(acc.balance);
    }, 0);

    // Aggregate deposits
    const depositsAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: "deposit",
        account: {
          userId,
        },
      },
    });

    // Aggregate withdrawals
    const withdrawalsAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: "withdrawal",
        account: {
          userId,
        },
      },
    });

    // Aggregate transfers (optional)
    const transfersAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: "transfer",
        account: {
          userId,
        },
      },
    });

    const totalDeposits = Number(depositsAgg._sum.amount || 0);
    const totalWithdrawals = Number(withdrawalsAgg._sum.amount || 0);
    const totalTransfers = Number(transfersAgg._sum.amount || 0);

    // Recent 5 transactions across all accounts
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        account: {
          select: {
            id: true,
            accountNumber: true,
            type: true,
          },
        },
      },
    });

    return {
      accountCount,
      totalBalance,
      totalDeposits,
      totalWithdrawals,
      totalTransfers,
      recentTransactions,
    };
  }
}
