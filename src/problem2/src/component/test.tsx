// interface WalletBalance {
//   currency: string
//   amount: number
// }

// interface FormattedWalletBalance {
//   currency: string
//   amount: number
//   formatted: string
// }

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

// ask chatgpt
interface FormattedWalletBalance extends WalletBalance {
  formattedAmount: number
}

interface Props extends BoxProps {}

export const WalletPage = (props: Props) => {
  const balances = useWalletBalances()
  const prices = usePrices()

  // type Any
  // not scalable pattern
  const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  }
  // const getPriority = (blockchain: any): number => {
  const getPriority = (blockchain: string): number => {
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

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // const balancePriority = getPriority(balance.blockchain)
        const balancePriority = priorityMap[balance.blockchain] ?? -99

        // undefined var, most likely to be blcPrio
        // if (lhsPriority > -99) {
        if (balancePriority > -99) {
          // should be >= 0
          // if (balance.amount <= 0) {
          if (balance.amount >= 0) {
            return true
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        if (leftPriority > rightPriority) {
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
      })
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
