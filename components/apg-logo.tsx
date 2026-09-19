import Image from "next/image";
import Link from "next/link";

type ApgLogoProps = { priority?: boolean };

export default function ApgLogo({ priority = false }: ApgLogoProps) {
  return (
    <Link href="/" className="apg-header-logo" aria-label="Any Part & Gear home">
      <Image
        src="/apg-logo.webp"
        alt="A.P.G. Any-Part & Gear LLC"
        width={172}
        height={50}
        className="apg-header-logo-image"
        priority={priority}
      />
    </Link>
  );
}
