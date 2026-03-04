import Logo from "./Logo";

const Navbar = ({ children }) => (
  <header className="px-6 md:px-10 py-6 flex items-center justify-between">
    <Logo />
    <div className="flex items-center gap-3">{children}</div>
  </header>
);

export default Navbar;
