import React from "react";
import Layout from "./Layout/Layout";
import HeroSection from "./HeroSection/HeroSection";
import Features from "./Features/Features";
import About from "./About/About";
import Contact from "./Contact/Contact";

export default function LandingPage() {
  return (
    <Layout>
      <HeroSection />
      <Features />
      <About />
      <Contact />
    </Layout>
  );
}
