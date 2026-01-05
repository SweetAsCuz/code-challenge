import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import type { TokenData } from '../App'

interface TokenModalProps {
  open: boolean
  onClose: () => void
  tokens: TokenData[]
  onSelect: (currency: string) => void
}

export default function TokenModal({ open, onClose, tokens, onSelect }: TokenModalProps) {
  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  const [search, setSearch] = useState('')

  const filteredTokens = useMemo(() => {
    return tokens
      .filter((token) => token.currency.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.currency.localeCompare(b.currency))
  }, [tokens, search])

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 " />

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative z-10 bg-[#1c1c21] text-white rounded-xl w-sm md:w-lg lg:w-xl p-6 transform transition-all duration-300 ease-out
          ${open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-full bg-gray-700 hover:bg-gray-500 cursor-pointer"
        >
          <Icon className="w-6 h-6" icon="material-symbols:close-rounded" />
        </button>

        <div className="flex flex-col gap-y-4">
          <div>
            <p className="text-lg font-semibold">Select a token</p>
            <p className="text-sm text-gray-400">Choose a token from the list below.</p>
          </div>

          <div className="flex items-center p-2 rounded bg-[#2a2a34]">
            <Icon icon="streamline-sharp:magnifying-glass" className="w-6 h-6 mr-2 p-1" />
            <input
              type="text"
              placeholder="Search by token"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full outline-none"
            />
          </div>

          <div className="h-92 overflow-y-auto bg-[#2a2a34] border border-gray-600 rounded-md p-2">
            {filteredTokens.length > 0 ? (
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <button
                    key={token.currency}
                    onClick={() => {
                      onSelect(token.currency)
                      onClose()
                    }}
                    className="w-full flex items-center gap-4 p-2 rounded hover:bg-white/10 transition cursor-pointer"
                  >
                    <img
                      src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`}
                      className="w-8 h-8"
                    />
                    <span className="text-lg">{token.currency}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-2 text-gray-400">No tokens found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
