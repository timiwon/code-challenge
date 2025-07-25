import type { Price, WalletBalance } from "./types";

export const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100
        case 'Ethereum':
            return 50
        case 'Arbitrum':
            return 30
        case 'Zilliqa':
            return 20
        case 'Neo':
            return 20
        default:
            return -99
    }
};

export const useWalletBalances = (): WalletBalance[] => {
    // just for example
    return [];
}

export const usePrices = (): Price => {
    // just for example
    return {
        Osmosis: 1,
        Ethereum: 1,
        Arbitrum: 1,
    };
};

export const filterWalletBalance = (balances: WalletBalance[]) => balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (balancePriority > -99) {
        if (balance.amount <= 0) {
            return true;
        }
    }
    return false;
}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
        return -1;
    } else if (rightPriority > leftPriority) {
        return 1;
    }

    return 0;
});