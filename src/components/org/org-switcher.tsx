"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Org {
  id: string
  name: string
  slug: string
}

interface OrgSwitcherProps {
  organizations: Org[]
}

export function OrgSwitcher({ organizations }: OrgSwitcherProps) {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentOrgSlug = params?.orgSlug as string
  const currentOrg = organizations.find((o) => o.slug === currentOrgSlug)

  function switchOrg(slug: string) {
    setOpen(false)
    router.push(`/${slug}`)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between"
      >
        {currentOrg?.name ?? "Select Organization"}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full mt-1 w-full rounded-md border bg-popover p-1 shadow-md z-20">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => switchOrg(org.slug)}
                className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
              >
                {org.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
