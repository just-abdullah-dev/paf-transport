import Button from "@/app/components/utils/Button";
import Link from "next/link";

export default function Header() {
  return (
    <header className=" bg-transparent fixed w-full top-0 left-0 z-50 backdrop-blur-md">
      <div className="container flex w-full py-4 items-center  max-w-7xl mx-auto">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1">
            <Link href="/" className="text-3xl font-bold text-custom-gradient">
              PAF Transport
            </Link>
          </div>
          <nav className="flex items-center">
            <Button>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
