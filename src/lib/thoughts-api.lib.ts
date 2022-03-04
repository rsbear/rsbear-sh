import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const thoughtsDirectory = join(process.cwd(), 'thoughts')

export function getThoughtsSlugs() {
  return fs.readdirSync(thoughtsDirectory)
}

export function getThoughtBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(thoughtsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllThoughts(fields: string[] = []) {
  const slugs = getThoughtsSlugs()
  const posts = slugs
    .map((slug) => getThoughtBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
