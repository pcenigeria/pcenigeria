import { HomePage } from "@/features/home"
import { getHomePage, getAllCapabilities } from "@/sanity/lib/queries"

export default async function Home() {
    const [sanityPage, sanityCapabilities] = await Promise.all([
        getHomePage(),
        getAllCapabilities(),
    ]);
    return <HomePage sanityPage={sanityPage} sanityCapabilities={sanityCapabilities} />
}
