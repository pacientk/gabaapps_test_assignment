import type { User } from '@/entities/user/model/schemas'

interface WorkTabProps {
  user: User
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-800 break-words">{value}</dd>
    </div>
  )
}

/** Work tab: company, department, title, and work address. */
export function WorkTab({ user }: WorkTabProps) {
  const { company } = user
  const workAddress = [
    company.address.address,
    company.address.city,
    company.address.state,
    company.address.postalCode,
    company.address.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <dl className="divide-y divide-gray-100">
      <Row label="Company" value={company.name} />
      <Row label="Department" value={company.department} />
      <Row label="Job Title" value={company.title} />
      <Row label="Work Address" value={workAddress} />
    </dl>
  )
}
