// V-1
import getUI from "@/services/read/getUI";
import { Navbar } from "./navbar";

export async function Header() {
  const uiData = await getUI();

  return <Navbar navbar={uiData.navbar} />;
}

export default Header;
