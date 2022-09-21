import { FC } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'

import { getAllThoughts, getThoughtBySlug } from '../../lib/thoughts-api.lib'
import Link from 'next/link'

const ThoughtPage: FC<any> = ({ thought, content }) => {
  return (
    <div className="mx-auto max-w-[75ch] py-20">
      <Link href="/thoughts">
        <a>
          <HiOutlineArrowNarrowLeft size={28} className="text-neutral-500" />
        </a>
      </Link>
      <h1 className="mt-10 text-2xl font-semibold">{thought.title} </h1>
      <div className="flex items-center pt-4">
        <p className="text-neutral-400">{thought.created}</p>
        {thought?.repo && (
          <a
            href={thought.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-4 border-l border-neutral-600 px-4 text-neutral-50 underline"
          >
            code
          </a>
        )}
      </div>
      <article className="prose pt-8">
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
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
              hellorosss@gmail.com
            </a>
          </li>
        </ul>
      </footer>
    </div>
  )
}
export default ThoughtPage

export const getStaticPaths = () => {
  const all = getAllThoughts(['slug'])

  return {
    paths: all.map((x) => ({ params: { slug: x.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: any) => {
  const thought = getThoughtBySlug(params.slug, [
    'title',
    'description',
    'created',
    'slug',
    'content',
    'repo',
  ])

  const parseContent = await remark()
    .use(html)
    .process(thought.content || '')
  const content = parseContent.toString()

  return { props: { thought, content } }
}
