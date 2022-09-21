---
id: 9037820p1jfsd9f893028402184
title: GraphQL wishes for the frontend.
desc: Please codegen, please..
slug: gql-bday-wish
created: April 15, 2022
year: 2022
repo:
---

I was recently looking back at graphql-codegen and saw they're working on [gql-tag-operations-preset]("https://www.the-guild.dev/graphql/codegen/plugins/presets/gql-tag-operations-preset"). 
Just.. WHY?! Sure it's cool and all that you're making a template literal type safe, but why!? Why is that the choice?
Can we just not write GraphQL as a language in our TypeScript codebases? 

Here is what I want..

```
const FurnitureItem: FC<{ id: string }> = (props) => {
  const { data } = useQuery({
    name: "whateverGetFurnitureById" // optional name of query
    query: "getFurnitureById" // a type safe union from type Query keys on upstream schema
    variables: {
      id: props.id
    },
    fields: [ // type safe union keys for type to be returned
      "id",
      "title",
      "sku",
      "colors": [
        "id",
        "name"
        "fabricType"
      ]
    ],
    options: {
      ...whatever options your data fetching lib does
    }
  })

  return <>...</>
}
```

See no graphql.. Is this bad? I feel like doing this would be pretty sick, but maybe i'm dead wrong.
you would stay in the context of react, and stay within the language of the rest of the logic.

