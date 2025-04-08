import Link from "next/link";
import Image from "next/image";
import Thumbnail from "@/assets/images/binchaIcon.png";
import LoginButton from "@/components/common/layout/LoginButton";
import Profile from "./Profile";
export default function Header({ role }: { role: string }) {
  return (
    <div className="flex w-full flex-row py-6 whitespace-nowrap md:justify-center">
      <div className="flex w-full flex-col items-center justify-center md:flex-row md:items-end">
        <Link href="/" className="w-fit">
          <h1 className="pr-3 text-4xl font-semibold text-zinc-700">
            내가 해야 할 일
          </h1>
        </Link>
        <span className="w-full text-end text-xs font-medium text-zinc-400 md:w-auto">
          벌어야 할 돈 말고도 뭐가 있었는데
        </span>
      </div>

      <div className="flex w-full flex-row justify-end">
        {role === "admin" ? (
          <Profile>
            <Image
              className="rounded-lg"
              src={Thumbnail}
              alt={"빈차 - 에픽하이"}
              width={60}
              height={60}
            />
          </Profile>
        ) : (
          <>
            <LoginButton />
          </>
        )}
      </div>
    </div>
  );
}
