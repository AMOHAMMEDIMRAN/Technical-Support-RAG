import { ModeToggle } from "../theme/mode-toggle";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <figure className="w-8 h-8">
              <img src="/kelo.svg" alt="Kelo" className="w-full h-full" />
            </figure>
            <h1 className="text-xl font-bold">Kelo</h1>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button>Login</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
