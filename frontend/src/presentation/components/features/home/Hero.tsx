import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import { Card } from "@/presentation/components/ui/card";
import {
  MessageSquare,
  LayoutDashboard,
  Sparkles,
  Zap,
  Shield,
  Star,
} from "lucide-react";




const Hero = () => {
  return (
    <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20" />

          <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-linear-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 py-1.5 shadow-lg shadow-blue-500/30 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    AI-Powered Support
                  </Badge>

                  <div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                      <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent drop-shadow-sm">
                        Kelo is here
                      </span>
                      <br />
                      <span className="text-primary">to help you</span>
                    </h1>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                    Experience instant, accurate technical support powered by
                    advanced RAG technology. Get 24/7 assistance for all your
                    technical questions.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 hover:scale-105 transition-transform shadow-sm">
                      <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                        Lightning Fast
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:scale-105 transition-transform shadow-sm">
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">
                        Secure & Private
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform shadow-sm">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        AI-Powered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    size="lg"
                    className="text-base px-8 h-14 gap-2 bg-primary transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Open Chat
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-14 gap-2 border-2 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all hover:scale-105"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Button>
                </div>
              </div>

              <div className="hidden relative lg:h-150 lg:flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="absolute top-[15%] left-[10%] p-5 shadow-2xl border-2 backdrop-blur-sm bg-linear-to-br from-background/95 to-background/80 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 w-80 animate-float">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 via-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-300 dark:ring-blue-500">
                        K
                      </div>
                      <div className="flex-1 space-y-2.5">
                        <div className="h-2.5 bg-linear-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full w-3/4 animate-pulse"></div>
                        <div
                          className="h-2.5 bg-linear-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 rounded-full w-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2.5 bg-linear-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full w-5/6 animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">
                        Typing...
                      </span>
                    </div>
                  </Card>

                  <Card className="absolute bottom-[15%] right-[8%] p-5 shadow-2xl border-2 backdrop-blur-sm bg-linear-to-br from-background/95 to-background/80 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 animate-float-delayed w-56">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-linear-to-br from-yellow-400 to-orange-400">
                          <Sparkles
                            className="w-4 h-4 text-white animate-spin"
                            style={{ animationDuration: "3s" }}
                          />
                        </div>
                        <span className="font-semibold text-sm">
                          AI Response
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                          &lt; 2s
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Average response time
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="absolute top-[35%] right-[25%] p-4 shadow-2xl border-2 backdrop-blur-sm bg-linear-to-br from-background/95 to-background/80 transform hover:scale-125 transition-all duration-500 animate-bounce-slow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-linear-to-br from-green-400 to-emerald-500">
                        <Shield className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          98%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Accuracy Rate
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="absolute top-[55%] left-[25%] p-4 shadow-xl border-2 backdrop-blur-sm bg-linear-to-br from-background/90 to-background/70 transform hover:scale-110 transition-all duration-500 animate-float"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">1000+</div>
                        <div className="text-xs text-muted-foreground">
                          Daily queries
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="absolute top-[12%] right-[15%] p-3 shadow-xl border backdrop-blur-sm bg-linear-to-br from-background/85 to-background/70 transform hover:scale-110 transition-all duration-500 animate-float-delayed"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 border-2 border-background"></div>
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 border-2 border-background"></div>
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-green-500 to-emerald-500 border-2 border-background"></div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold">
                          24/7 Available
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="absolute bottom-[45%] left-[8%] p-3 shadow-xl border backdrop-blur-sm bg-linear-to-br from-background/85 to-background/70 transform hover:scale-110 transition-all duration-500 animate-bounce-slow"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold ml-1">5.0</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      User rating
                    </div>
                  </Card>

                  <Card
                    className="absolute bottom-[8%] left-[18%] p-3 shadow-xl border backdrop-blur-sm bg-linear-to-br from-background/85 to-background/70 transform hover:scale-110 transition-all duration-500 animate-float"
                    style={{ animationDelay: "1.2s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          className="w-8 h-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin"
                          style={{ animationDuration: "2s" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          99.9%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uptime
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>

                  <div
                    className="absolute top-[20%] right-[30%] w-32 h-32 bg-linear-to-r from-purple-400 to-pink-400 rounded-full filter blur-2xl opacity-20 animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                  <div
                    className="absolute bottom-[25%] left-[35%] w-40 h-40 bg-linear-to-r from-cyan-400 to-blue-400 rounded-full filter blur-2xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                  ></div>
                </div>

                <svg
                  className="absolute inset-0 w-full h-full opacity-10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="1"
                        className="fill-blue-600 dark:fill-blue-400"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
  )
}
export default Hero