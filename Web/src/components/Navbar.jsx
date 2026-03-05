import Logo from "./Logo";
import Search from "./Search";

const Navbar = ({ children }) => (
  <header className="px-6 md:px-10 py-6 w-full flex items-center justify-between">
    <Logo />
    <div className="hidden md:flex md:w-full">
      <Search />
    </div>
    <div className="flex items-center gap-3">{children}</div>
  </header>
);

export default Navbar;
