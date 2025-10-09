import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
  <div className="flex items-center gap-4">
    <Image
      className="dark:invert"
      src="/next.svg"
      alt="Next.js logo"
      width={180}
      height={38}
      priority
    />
    <Image
      src="/OIP.webp"
      alt="Next.js logo"
      width={120}
      height={30}
      priority
    />
  </div>
        <h2>Quản lý sinh viên</h2>
        <ol className=" list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Quản lý danh sách sinh viên
          </li>
          <li className="tracking-[-.01em]">
            Quản lý danh sách lớp
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
      <a
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
        Github
      </a>
        </div>
      </main>
    </div>
  );
}
