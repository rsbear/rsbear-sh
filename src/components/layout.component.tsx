import { FC } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const Layout: FC<{ title: string; children: JSX.Element }> = ({
  title,
  children,
}) => {
  return (
    <div className="mx-auto w-[600px]">
      <Head>
        <title>ross stevens and the web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-20">
        <Link href="/">
          <a className="pb-10 text-2xl font-semibold text-neutral-50">
            {title}
          </a>
        </Link>
        <nav className="flex justify-end pb-4">
          <Link href="/thoughts">
            <a className="text-neutral-50 underline">Thoughts</a>
          </Link>
        </nav>
        {children}
      </main>

      <footer className="mb-20 mt-10 border-t border-neutral-600">
        <ul className="flex items-center pt-10">
          <li>
            <a
              className="flex items-center justify-center gap-2 underline"
              href="https://github.com/rsbear"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li className="mx-2">&middot;</li>
          <li>
            <a
              className="flex items-center justify-center gap-2 underline"
              href="mailto:hellorosss@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              ross@rsbear.sh
            </a>
          </li>
        </ul>
      </footer>
    </div>
  )
}

export default Layout
