import { CircularProjects } from "@/features/projects/components/circular-projects";
import { projects } from "@/features/projects/constants/projects-data";

export default function ProjectsPage() {
  return (
    <main className="w-full bg-black min-h-screen">
      <CircularProjects projects={projects} autoplay={true} />
    </main>
  );
}
