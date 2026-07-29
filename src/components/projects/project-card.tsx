import Link from "next/link"
import { FolderKanban, Layers, ListTodo } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    lead: { id: string; name: string | null; image: string | null } | null
    _count: { issues: number; sprints: number }
  }
  orgSlug: string
}

export function ProjectCard({ project, orgSlug }: ProjectCardProps) {
  return (
    <Link href={`/${orgSlug}/projects/${project.slug}`}>
      <Card className="group hover:border-ring/50 transition-colors cursor-pointer h-full">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {project.icon ?? <FolderKanban className="size-5" />}
              </div>
              <div>
                <h3 className="font-medium leading-none group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ListTodo className="size-3.5" />
              {project._count.issues} issues
            </span>
            <span className="flex items-center gap-1">
              <Layers className="size-3.5" />
              {project._count.sprints} sprints
            </span>
          </div>

          {project.lead && (
            <div className="flex items-center gap-2 text-sm">
              <Avatar
                src={project.lead.image}
                fallback={project.lead.name?.[0] ?? "L"}
                size="sm"
              />
              <span className="text-muted-foreground">{project.lead.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
