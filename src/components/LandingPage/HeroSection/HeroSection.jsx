import Button from "@/components/utils/Button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className=" text-primary bg-[url('/buses.jpg')] bg-no-repeat bg-center bg-cover py-40 relative">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      <div className="container mx-auto max-w-7xl px-8 xl:px-0 z-10 relative">
        <div className=" grid place-items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-custom-gradient w-fit cursor-pointer">
            PAF-IAST Transportation System
          </h1>
          <p className="text-base md:text-xl mb-8 text-white mt-6">
            Simplifying student transportation management for university.
          </p>
          <Button>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
