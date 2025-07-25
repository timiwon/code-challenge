/**
 * First of all thank you for giving me this opportunity.
 * Maybe text can cause confusing so I will note the message info here,
 * then will resolve the problems in refactored folder.
 */

/**
 * If this is not a type for props of component, we should move it to another file,
 * it is easier for team working and maintenance.
 */
interface WalletBalance {
  currency: string;
  amount: number;
}
/**
 * Should use extends type in this case
 */
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

/**
 * We shouldn`t define a type without any attributes inside, and should name it more meaning.
 * If in case we want use on some exists types we could do like this:
 *   EX: type WalletPageProps = BaseProps & BoxProps;
 */
interface Props extends BoxProps {

}
/**
 * On my opinion everything shoud be visualization, so I think it is better for maintenance later.
 *   EX: {
 *     ...
 *     children?: React.ReactNode; 
 *   }
 * 
 * Further, we should choose 1 type for using, I never see this before, and destructuring props with shorter way.
 *   EX: 
 *     1. const WalletPage: React.FC<Props> = ({ childrend, ... rest })
 *     2. const WalletPage = ({ childrend, ... rest }: Props)
 */
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  /**
   * It is better to declare variable with type.
   *   EX:
   *     const balances: WalletBalance[] = useWalletBalances();
   * 
   * We miss define Price type:
   *    interface Price {
   *        [key: string]: number;
   *    }
   *    const prices: Price[] = usePrices(); 
   */
  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * Shouldn`t use any in typescript 
   *   Ex: blockchain: string
   * Should move this function to another file
   */
	const getPriority = (blockchain: any): number => {
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
	}

/**
 * This is not clean and hard to maintenance:
 * 1. First thing we should define a function to visible all variables needed for this block code,
 *   then we will easy to check when it is need to be rerendered.
 *   In this case `prices` is not need to include in dependencies of useMemo
 * 2. Maybe we need to consider using useMemo or make sure formatting and ordering the values returned from
 *    useWalletBalances function. I usually use useState for this case.
 */
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
        /**
         * 1. type WalletBalance miss define blockchain prop => so it may cause Error in typescript validation and confuse for team working.
         * 2. balancePriority is declared but never read
         */
		  const balancePriority = getPriority(balance.blockchain);
          /**
           * lhsPriority is not declared 
           */
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
          /**
           * Maybe we should move this to a function for reusing purpose
           */
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  /**
   * formattedBalances is declared but never read
   */
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  /**
   * 1. `formatted` prop is missing in sortedBalances, we should use formattedBalances.
   */
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    /**
     * We maybe reach missing key in prices we should do s.th here.
     * Depend on logic flow on next step we should consider assign value to 0 or -1 to usdValue
     *    EX: const usdValue = prices[balance.currency]??0 * balance.amount;
     */
    const usdValue = prices[balance.currency] * balance.amount;

    /**
     * classes is not declared 
     */
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}