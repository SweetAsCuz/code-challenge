import { useEffect, useState } from 'react'
import TokenModal from './component/TokenModal'
import DisplaySection from './component/DisplaySection'
import { Icon } from '@iconify/react'

export interface TokenData {
  currency: string
  date: string
  price: number
}

export default function App() {
  const [currencyData, setCurrencyData] = useState<TokenData[]>([])
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USD')
  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectingSide, setSelectingSide] = useState<'from' | 'to'>('from')
  const [isFlipping, setIsFlipping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then((res) => res.json())
      .then((data: TokenData[]) => {
        const latestData = deduplicateToken(data)
        setCurrencyData(latestData)
      })
  }, [])

  const fromTokenData = currencyData.find((c) => c.currency === fromToken)
  const toTokenData = currencyData.find((c) => c.currency === toToken)

  useEffect(() => {
    setToAmount(calculateExchangeRate(fromAmount, fromTokenData, toTokenData))
  }, [fromAmount, fromTokenData, toTokenData, fromToken, toToken])

  /**
   * Deduplicate token based on the date
   */
  function deduplicateToken(data: TokenData[]): TokenData[] {
    const tokenMap: Record<string, TokenData> = {}

    data.forEach((token) => {
      const existing = tokenMap[token.currency]
      if (!existing || new Date(token.date) > new Date(existing.date)) {
        tokenMap[token.currency] = token
      }
    })

    return Object.values(tokenMap)
  }

  function calculateExchangeRate(
    fromAmount: string,
    fromTokenData: TokenData | undefined,
    toTokenData: TokenData | undefined
  ): number {
    if (!fromTokenData?.price || !toTokenData?.price) return 0
    const result = (Number(fromAmount) * fromTokenData.price) / toTokenData.price
    return Number(result.toFixed(6))
  }

  function flipTokens(): void {
    setIsFlipping(true)

    setTimeout(() => {
      setFromToken(toToken)
      setToToken(fromToken)
      setFromAmount(String(toAmount))
      setIsFlipping(false)
    }, 500)
  }

  function getTokenIcon(symbol: string): string {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`
  }

  function submitSwap() {
    if (isSubmitting) return

    if (!fromTokenData || !toTokenData) {
      alert('Token data not loaded')
      return
    }

    if (fromToken === toToken) {
      alert('Cannot swap the same token')
      return
    }

    const amount = Number(fromAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (fromUsdValue! >= 1_000_000_000_000) {
      alert('Are you serious?')
      return
    }

    setIsSubmitting(true)

    // Simulate Submit
    setTimeout(() => {
      setFromToken('ETH')
      setToToken('USD')
      setFromAmount('0')

      alert(`Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`)
      setIsSubmitting(false)
    }, 1500)
  }

  const fromUsdValue =
    fromTokenData && fromAmount ? Number(fromAmount) * fromTokenData.price : undefined

  // const toUsdValue = toTokenData && toAmount ? toAmount * toTokenData.price : undefined

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-black">
      <div className="flex flex-col items-center text-white p-0 w-sm md:w-md lg:w-lg rounded-lg">
        <div className="bg-[#141417] mb-4 w-full">
          {/* Input (From) */}
          <DisplaySection
            label={'Amount to send'}
            amount={fromAmount}
            token={fromToken}
            onAmountChange={setFromAmount}
            onTokenClick={() => {
              setSelectingSide('from')
              setModalOpen(true)
            }}
            getTokenIcon={getTokenIcon}
            usdValue={fromUsdValue!}
          ></DisplaySection>

          {/* Flip Button */}
          <div className="flex items-center">
            <div className="flipHorizontalLine" />
            <span
              className="cursor-pointer p-3 rounded-full hover:bg-gray-700/30"
              onClick={flipTokens}
            >
              <Icon
                className="w-4 h-4 md:w-6 md:h-6"
                icon={isFlipping ? 'line-md:loading-loop' : 'iconamoon:swap'}
              />
            </span>
            <div className="flipHorizontalLine" />
          </div>

          {/* Output (To) */}
          <DisplaySection
            label={'Amount to receive'}
            amount={toAmount}
            token={toToken}
            readOnly
            onTokenClick={() => {
              setSelectingSide('to')
              setModalOpen(true)
            }}
            getTokenIcon={getTokenIcon}
            // usdValue={toUsdValue!}
          />
        </div>

        <button
          onClick={submitSwap}
          disabled={isSubmitting}
          className={`w-1/2 mx-auto px-10 py-4 rounded-full duration-300 text-sm md:text-base
    ${
      isSubmitting
        ? 'bg-gray-400 text-black cursor-not-allowed'
        : 'bg-white text-black hover:bg-gray-400 cursor-pointer'
    }`}
        >
          {isSubmitting ? 'Loading...' : 'Confirm Swap'}
        </button>
      </div>

      <TokenModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tokens={currencyData}
        onSelect={(currency: string) => {
          selectingSide === 'from' ? setFromToken(currency) : setToToken(currency)
        }}
      />
    </main>
  )
}
