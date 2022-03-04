import Link from 'next/link'
import { FC } from 'react'
import Layout from '../../components/layout.component'
import { getAllThoughts } from '../../lib/thoughts-api.lib'

const Thoughts: FC<any> = ({ thoughts }) => {
  console.log(thoughts)
  return (
    <Layout title="Thoughts">
      <ul>
        {thoughts?.map((x) => (
          <li key={x.id}>
            <Link href={`/thoughts/${x.slug}`}>
              <a className="flex flex-col text-lg font-semibold transition-colors hover:opacity-70">
                <span className="text-xs font-normal text-neutral-400">
                  {x.created}
                </span>
                <span className="pt-2">{x.title}</span>
                <span className="text-sm font-normal text-neutral-400">
                  {x.desc}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default Thoughts

export const getStaticProps = () => {
  const thoughts = getAllThoughts(['title', 'slug', 'created', 'id', 'desc'])
  return {
    props: {
      thoughts,
    },
  }
}
