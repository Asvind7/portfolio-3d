import DesktopEnvironment from "@/components/DesktopEnvironment";

export default function Home() {
  return (
    <main className="fixed inset-0 text-foreground overflow-hidden bg-transparent">
      {/* Background provided by global BackgroundCanvas */}
      <DesktopEnvironment />
    </main>
  );
}
