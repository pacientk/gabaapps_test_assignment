'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { User } from '@/entities/user/model/schemas'
import { truncateWallet } from '@/shared/lib/formatters'

interface CryptoTabProps {
  user: User
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-800">{value}</dd>
    </div>
  )
}

/** Copyable wallet address button */
function WalletAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy wallet address"
      className="group flex items-center gap-1.5 font-mono text-sm text-gray-800 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
    >
      <span>{truncateWallet(address)}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500" />
      )}
    </button>
  )
}

/** Crypto tab: coin, copyable wallet address, network. */
export function CryptoTab({ user }: CryptoTabProps) {
  const { crypto } = user
  return (
    <dl className="divide-y divide-gray-100">
      <Row label="Coin" value={crypto.coin} />
      <Row label="Wallet" value={<WalletAddress address={crypto.wallet} />} />
      <Row label="Network" value={crypto.network} />
    </dl>
  )
}
