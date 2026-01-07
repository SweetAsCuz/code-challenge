/**
  1. Interfaces
  - added blockchain: string to WalletBalance
  - FormattedWalletBalance extended from WalletBalance instead

  2. WalletPage()
  - added export
  - React.FC always gives children prop which might not be good

  3. getPriority()
  - use map instead for scalability
  - updated blockchain type to string

  4. sortedBalances
  - updated filter and sort structure for better readability and better handling for equal values 
  - updated comparison <= 0 to >= 0

  5. const formattedBalances
  - added type
  - toFixed(6), which is mostly for display only

  6. const rows
  - use formattedBalances instead
  - used balance.amount in usdValue calculation since formattedAmount is a string and mostly used for display only
  - added unique key
 */

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formattedAmount: number
}

interface Props extends BoxProps {}

export const WalletPage = (props: Props) => {
  const balances = useWalletBalances()
  const prices = usePrices()

  const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  }

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          (priorityMap[balance.blockchain] ?? -99) > -99 && balance.amount >= 0
      )

      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          // return negative - lhs comes before rhs
          // return positive - rhs comes before lhs
          // return 0 - keep their order the same
          (priorityMap[rhs.blockchain] ?? -99) - (priorityMap[lhs.blockchain] ?? -99)
      )
  }, [balances, prices])

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance: WalletBalance) => {
      return {
        formattedAmount: balance.amount.toFixed(6),
        ...balance,
      }
    }
  )

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formattedAmount}
      />
    )
  })

  return <div {...props}>{rows}</div>
}
