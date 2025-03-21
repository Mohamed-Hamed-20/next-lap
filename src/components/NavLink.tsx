"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href);

  const isExternal = href.startsWith("http");

  return (
    <li className="relative group">
      <Link
        href={href}
        className={`transition-all duration-300 font-medium text-lg px-3 py-2 ${
          isActive ? "text-[#9e6b2a] font-semibold" : "hover:text-[#9e6c2ab4]"
        }`}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </Link>
      {/* الخط السفلي المتحرك عند التفعيل أو التمرير */}
      <span
        className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#9e6b2a] rounded transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0"
        } group-hover:scale-x-100`}
      ></span>
    </li>
  );
}
