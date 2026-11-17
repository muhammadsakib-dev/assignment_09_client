// V-1
export interface NavDropdownItem {
  name: string;
  href: string;
  description?: string;
}

export type NavIconName =
  | "heart"
  | "calendar"
  | "briefcase"
  | "shield"
  | "users";

export interface NavItem {
  name: string;
  href: string;
  badge?: string;
  icon?: NavIconName;
  isDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
}

export interface NavbarBrand {
  logoUrl: string;
}

export interface NavbarAction {
  label: string;
  href: string;
  variant: "outline" | "solid";
}

export interface NavbarConfig {
  brand: NavbarBrand;
  navItems: NavItem[];
  navItemsLoggedIn?: NavItem[];
  navItemsUser?: NavItem[];
  navItemsVendor?: NavItem[];
  navItemsAdmin?: NavItem[];
  actions: NavbarAction[];
}

export interface UIData {
  navbar: NavbarConfig;
  [key: string]: unknown;
}

export interface UIResponse {
  success: boolean;
  message?: string;
  data: UIData;
}
