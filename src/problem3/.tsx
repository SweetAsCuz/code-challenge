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
