import { HomePage } from "@/features/home"
import { getHomePage } from "@/sanity/lib/queries"

export default async function Home() {
    const sanityPage = await getHomePage();
    return <HomePage sanityPage={sanityPage} />
}
