import NavLink from "./NavLink";
import Logo from "./Logo";

const Nav = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b-1 mb-2">
      <Logo />
      <div>
        <NavLink href="/">Users</NavLink>
        <NavLink style="ml-4" href="/cards">
          Cards
        </NavLink>
        <NavLink style="ml-4" href="/departments">
          Departments
        </NavLink>
        <NavLink style="ml-4" href="/locations">
          Locations
        </NavLink>
      </div>
    </div>
  );
};

export default Nav;
