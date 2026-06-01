import { getEvents } from "@/lib/pocketbase";
import ReservationProvider from "./components/ReservationProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import RingLayout from "./components/RingLayout";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import ClubMap from "./components/ClubMap";
import Reservation from "./components/Reservation";
import LocationMap from "./components/LocationMap";
import Footer from "./components/Footer";

// Uvek čitaj sveže događaje iz PocketBase-a (bez keširanja na build-u)
export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getEvents();

  return (
    <ReservationProvider events={events}>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <RingLayout />
        <Events events={events} />
        <Gallery />
        <ClubMap />
        <Reservation />
        <LocationMap />
      </main>
      <Footer />
    </ReservationProvider>
  );
}
