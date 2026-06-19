import { redirect } from "next/navigation";

export default function WelcomePage() {
  redirect("/docs#welcome");
}
