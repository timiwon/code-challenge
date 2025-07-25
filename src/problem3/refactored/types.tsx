export interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

export interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

export interface Price {
    [key: string]: number;
}
