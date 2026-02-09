import { useState } from "react"
import { ModeToggle } from "../theme/mode-toggle"
import { Button } from "../ui/button"
import Login from "../features/login/Login"

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
            <Button onClick={() => setShowLogin(true)}>Login</Button>
          </div>
        </div>
      </header>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header
