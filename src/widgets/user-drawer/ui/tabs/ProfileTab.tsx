import type { User } from '@/entities/user/model/schemas'
import { formatDate, formatPhone } from '@/shared/lib/formatters'

interface ProfileTabProps {
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

/** Profile tab: personal info, contact, physical stats, address, university. */
export function ProfileTab({ user }: ProfileTabProps) {
  const address = [
    user.address.address,
    user.address.city,
    user.address.state,
    user.address.postalCode,
    user.address.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <dl className="divide-y divide-gray-100">
      <Row label="Username" value={`@${user.username}`} />
      <Row label="Age" value={`${user.age} years old`} />
      <Row label="Gender" value={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} />
      <Row label="Blood Group" value={user.bloodGroup} />
      <Row label="Born" value={formatDate(user.birthDate)} />
      <Row label="Height" value={`${user.height} cm`} />
      <Row label="Weight" value={`${user.weight} kg`} />
      <Row label="Eye Color" value={user.eyeColor} />
      <Row label="Hair" value={`${user.hair.color}, ${user.hair.type}`} />
      <Row label="Email" value={user.email} />
      <Row label="Phone" value={formatPhone(user.phone)} />
      <Row label="Address" value={address} />
      <Row label="University" value={user.university} />
    </dl>
  )
}
