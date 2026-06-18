import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import FAQs from "./components/FAQs";
// import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <CTA />
        <FAQs />
      </main>
      {/* <Footer /> */}
    </>
  );
}