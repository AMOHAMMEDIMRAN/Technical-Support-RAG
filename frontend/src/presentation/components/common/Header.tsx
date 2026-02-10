import { useState } from "react"
import { ModeToggle } from "../theme/mode-toggle"
import { Button } from "../ui/button"
import Login from "../features/login/Login"
import { useAuthStore } from "@/presentation/stores/authStore";


const Header = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/kelo.svg" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Kelo</h1>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <AuthButton onLoginOpen={() => setShowLogin(true)} />
          </div>
        </div>
      </header>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header



 
export const AuthButton = ({ onLoginOpen }: { onLoginOpen: () => void }) => {
  const { isAuthenticated, logout, isLoading } = useAuthStore();

  return isAuthenticated ? (
    <Button
      variant="destructive"
      onClick={logout}
      disabled={isLoading}
    >
      Logout
    </Button>
  ) : (
    <Button onClick={onLoginOpen}>
      Login
    </Button>
  );
};

 
