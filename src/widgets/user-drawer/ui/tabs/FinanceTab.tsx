import type { User } from '@/entities/user/model/schemas'
import { maskCardNumber, maskIban } from '@/shared/lib/formatters'

interface FinanceTabProps {
  user: User
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="font-mono text-sm text-gray-800">{value}</dd>
    </div>
  )
}

/** Finance tab: masked card details, currency, and masked IBAN. */
export function FinanceTab({ user }: FinanceTabProps) {
  const { bank } = user
  return (
    <dl className="divide-y divide-gray-100">
      <Row label="Card Type" value={bank.cardType} />
      <Row label="Card Number" value={maskCardNumber(bank.cardNumber)} />
      <Row label="Expires" value={bank.cardExpire} />
      <Row label="Currency" value={bank.currency} />
      <Row label="IBAN" value={maskIban(bank.iban)} />
    </dl>
  )
}
