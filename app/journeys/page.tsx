import { redirect } from "next/navigation";
import { DEFAULT_COLLECTION_SLUG } from "@/data/journeys";

export default function JourneysIndexPage() {
  redirect(`/journeys/${DEFAULT_COLLECTION_SLUG}`);
}
