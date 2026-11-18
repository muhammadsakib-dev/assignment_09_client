import { Navbar } from "./navbar";
import { navbarConfig } from "./navbar-data";

export function Header() {
  return <Navbar navbar={navbarConfig} />;
}

export default Header;
