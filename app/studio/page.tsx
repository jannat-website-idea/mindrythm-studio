import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { getEnquiries, getSiteContent } from "@/db/content";
import { redirect } from "next/navigation";
import { StudioClient } from "./studio-client";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await getChatGPTUser();
  if (!user && process.env.NODE_ENV !== "development") {
    redirect(chatGPTSignInPath("/studio"));
  }

  return (
    <StudioClient
      initialContent={await getSiteContent()}
      initialEnquiries={await getEnquiries()}
      editorName={user?.displayName ?? "Demo editor"}
    />
  );
}
