import { ThemeCustomizer } from "@/components/wrappers/theme-customizer";

export default function ConfiguracionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-8">
        <section>
          <ThemeCustomizer />
        </section>
      </div>
    </div>
  );
}
