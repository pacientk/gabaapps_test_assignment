interface UserDetailPageProps {
  params: { id: string }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return (
    <main>
      <h1>User {params.id}</h1>
    </main>
  )
}
