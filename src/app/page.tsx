import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { Features } from "./components/features";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { Navbar } from "./components/navbar";

export default async function Home() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user) {
      return redirect("/dashboard");
    }
  } catch {
    // Continue to landing page if not authenticated or database connecting
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
