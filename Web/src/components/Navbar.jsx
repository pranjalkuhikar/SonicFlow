import Logo from "./Logo";
import Search from "./Search";

const Navbar = ({ children }) => (
  <header className="px-4 sm:px-6 md:px-10 py-6 w-full">
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between w-full gap-6">
        <Logo />
        <div className="flex w-full justify-end">{children}</div>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <Search />
      </div>
    </div>
  </header>
);

export default Navbar;
