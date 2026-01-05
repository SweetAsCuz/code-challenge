import { Icon } from '@iconify/react'

interface DisplaySectionProps {
  label: string
  amount: string | number
  token: string
  usdValue?: number
  readOnly?: boolean
  onAmountChange?: (value: string) => void
  onTokenClick: () => void
  getTokenIcon: (symbol: string) => string
}

export default function DisplaySection({
  label,
  amount,
  token,
  readOnly = false,
  onAmountChange,
  onTokenClick,
  getTokenIcon,
  usdValue,
}: DisplaySectionProps) {
  return (
    <div className="px-6 py-5">
      <label className="font-medium text-sm md:text-base text-[#AFAFB2]">{label}</label>
      <div className="flex gap-2 items-center mt-8">
        <input
          type="text"
          inputMode="decimal"
          readOnly={readOnly}
          value={amount}
          onChange={(e) => {
            if (!onAmountChange) return

            let v = e.target.value // input value

            // allow only numbers & one dot
            if (!/^\d*\.?\d*$/.test(v)) return

            // normalize input
            if (v === '.') v = '0.'
            if (v === '') v = '0'

            // remove leading zeros
            if (v.length > 1 && v[0] === '0' && v[1] !== '.') {
              v = v.replace(/^0+/, '')
            }

            // Limit integer and decimal length
            const [intPart, decimalPart] = v.split('.')
            const MAX_INTEGER_DIGITS = 12
            const MAX_DECIMALS = 6

            if (intPart.length > MAX_INTEGER_DIGITS) return

            if (decimalPart && decimalPart.length > MAX_DECIMALS) return

            onAmountChange(v)
          }}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-base md:text-lg"
        />

        <button
          onClick={onTokenClick}
          className="flex justify-center items-center gap-2 cursor-pointer pl-2 pr-3 py-1.5 rounded-full border bg-[#ffffff0a] border-white/20 hover:bg-white/10"
        >
          <img src={getTokenIcon(token)} className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          <span className="text-xs md:text-sm lg:text-md">{token}</span>
          <Icon icon="line-md:chevron-down" className="w-4 h-4" />
        </button>
      </div>

      <span className="text-[#AFAFB2] text-sm font-semibold">
        {usdValue === undefined || usdValue === null
          ? null
          : usdValue === 0
          ? '$0.00'
          : usdValue >= 1_000_000_000_000
          ? 'Are you serious?'
          : `$${usdValue.toFixed(2)}`}
      </span>
    </div>
  )
}
