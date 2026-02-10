import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { useAuthStore } from "@/presentation/stores/authStore";

import { MessageSquare, Sparkles, Building2, Zap, Shield } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20" />

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full py-8 lg:py-0">
            <div className="space-y-6 sm:space-y-8">
              <Badge className="bg-card text-foreground border border-border px-3 py-1 font-medium shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Always available AI
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Kelo
                </span>
                <br />
                <span className="text-primary">RAG for teams</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Kelo helps people in your company get answers anytime, without
                waiting on others, while you control who can access what.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">24/7 availability</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Private & secure</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Role-based access</span>
                </div>
              </div>

<div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
  <Button
    size="lg"
    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-12 gap-2"
  >
    <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5" />
    Open chat
  </Button>

  {isAuthenticated && (
    <Button
      variant="outline"
      size="lg"
      className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-12 gap-2"
    >
      <Building2 className="w-4 sm:w-5 h-4 sm:h-5" />
      Create organization
    </Button>
  )}
</div>

            </div>

            <div className="hidden lg:block relative h-full min-h-125">
              <img
                src="/hero-image-1.svg"
                alt="Hero Image"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Hero;
