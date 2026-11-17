import { redirect } from "next/navigation";

export default function VendorsPage() {
  redirect("/sign-up?role=vendor");
}
