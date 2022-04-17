import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout.component";

const Home: NextPage = () => {
	return (
		<Layout title="Ross Stevens">
      <>
        <p className="pb-4 text-neutral-400">
          I'm a frontend engineer based in Austin, TX, currently building at
          Favish. Originally a server at various local restaurants, engineering
          for the web was just a hobby.
        </p>
        <p className="pb-10 text-neutral-400">
          I'm proud that my passion has become my work. It&apos;s a blast being
          presented with new problems to solve and exploring the vast space that
          is technology. Currently obsessed with frontend optimizations and
          architecture techniques; stoked about the possibilites of edge workers
          and delivering UI's closer to end users.
        </p>
        <HomeContents />
      </>
    </Layout>
	);
};

export default Home;

const HomeContents = () => (
	<ul className="list-disc pl-4 text-neutral-400">
    <li className="pb-4">
      <p>
        <a
          href="https://nvimluau.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-100 underline"
        >
          nvimluau.dev
        </a>{' '}
        is a collection of Neovim plugins written in Lua; an attempt to
        consolidate a plugins list, and quickly browse the README's.
      </p>
    </li>
    <li className="pb-4">
      <p>
        I wanted to explore parsers so I made{' '}
        <a
          href="https://github.com/rsbear/gp-schematic"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-100 underline"
        >
          gp-schematic
        </a>{' '}
        - an NPM module for parsing a Prisma schema and generating a GraphQL
        schema.{' '}
        <Link href="/thoughts/prisma-to-graphql-parsing">
          <a className="text-neutral-50 underline">Read more</a>
        </Link>
      </p>
    </li>
  </ul>
);
