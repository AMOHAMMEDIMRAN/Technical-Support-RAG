import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"

const Login = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[380px] rounded-2xl border bg-card p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
        </div>

        <Button className="mt-6 w-full">Login</Button>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
