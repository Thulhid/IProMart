import Image from "next/image";
import Link from "next/link";

function Logo({ photoUrl, configStyles, width = 70, height = 60 }) {
  return (
    <div className={`w-[3rem] md:w-[5rem] ${configStyles}`}>
      <Link href="/">
        <Image
          src={photoUrl || "/logo/logo-white.png"}
          alt="IProMart_logo"
          width={width}
          height={height}
        />
      </Link>
    </div>
  );
}

export default Logo;
