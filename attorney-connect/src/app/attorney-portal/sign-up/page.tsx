import { redirect } from "next/navigation";

// Sign-up now happens through the /join flow
export default function SignUpRedirect() {
  redirect("/join");
}
