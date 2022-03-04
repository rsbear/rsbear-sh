---
id: 9037840p1jfsd9f893028402134
title: Parsing Prisma, generating GraphQL
desc: Prisma so close to GraphQL, do I really need to manually keep both schema's in sync..
slug: prisma-to-graphql-parsing
created: June 25, 2021
year: 2021
repo: https://github.com/rsbear/gp-schematic
---

For a little context, I really wanted to explore writing a parser and to understand the nuances of them at some level.
The Prisma schema was a simply a prime candidate. Way back when, they were graph.cool - and they innovated from the idea of blending of the GraphQL layer and the database itself. Ultimately they rebranded when they separated the concerns of the two layers, and in my opinion was good call. Some core ideas remain though with Prisma and ultimately ended up creating a schema language for themselves that very closely resembles what you might see for GraphQL. For instance:

```
model Recipe {
  id           Int        @id @default(autoincrement())
  title        String
  cookingTime  Int
  ingredients  Ingredients[] @relation(fields: [ingredientId, references: [id]])
}
```

and a GraphQL schema...

```
type Recipe {
  id: Int
  title: String
  cookingTime: Int
  ingredients:  [Ingredients]
}
```

They're basically identical in some regards right.. let's give it a shot. It looks like we might be able to loop over the rows in the document and then perhaps trim the string of the value of said row.
