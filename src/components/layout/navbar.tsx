import { UserMenu } from "@/components/layout/user-menu"

export function Navbar() {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg">DevFlow</span>
      </div>
      <div className="flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  )
}
