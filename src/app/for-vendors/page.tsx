import { redirect } from "next/navigation";

export default function ForVendorsPage() {
  redirect("/sign-up?role=vendor");
}
