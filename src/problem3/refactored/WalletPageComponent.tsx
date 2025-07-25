import React, { useMemo } from 'react';

import type { WalletBalance, FormattedWalletBalance, Price } from "./types";
import { useWalletBalances, usePrices, filterWalletBalance } from './utils';

 // assume BoxProps exist somewhere
interface BoxProps {
    children?: React.ReactNode;
    classes: {
        row: string
    };
}
const WalletPage = ({ children, classes, ...restProps }: BoxProps) => {
    const balances: WalletBalance[] = useWalletBalances();
    const prices: Price = usePrices();
    const sortedBalances = useMemo(() => filterWalletBalance(balances), [balances]);
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed()
    }));

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => (<WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={prices[balance.currency] ?? 0 * balance.amount}
        formattedAmount={balance.formatted}
    />));

    return (<div {...restProps}>
        {rows}
    </div>);
};

interface WalletRowProps {
    amount: number;
    usdValue: number;
    formattedAmount: string;
    key?: string|number;
    className?: string;
}
const WalletRow = ({className, key, amount, usdValue, formattedAmount}: WalletRowProps) => {
    // just for example
    return (<></>);
};