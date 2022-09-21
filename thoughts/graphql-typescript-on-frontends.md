---
id: 9037820p1jfsd9f893028402184
title: GraphQL and TypeScript on the frontend.
desc: Because we need it..
slug: graphql-typescript-on-frontends
created: April 14, 2022
year: 2022
repo:
---

GraphQL on the frontend, it's nice - clear, concise, and in classic GraphQL fashion, self documenting.
That's great and all, but since it's a different language you can just forget about leveraging TypeScript.
And that sucks. Let's take a look at a basic example.

```typescriptreact
//MarketData.component.tsx
...import statements

const MARKET_DATA_QUERY = gql`
	query getStock($symbol: String!, $currency: String!) {
	  getStock(symbol: $symbol, currency: $currency) {
		  ask
      bid
		}
	}
`

const MarketData: FC<{ ... }> = (...) => {
	const { data } = useQuery(MARKET_DATA_QUERY, {
    variables: { currency: "USD", symbol: "NVDA" } // not type safe :(
	})

	return (
	  <div>
      <h3>NVDA Ask</h3>
      <span>{data?.getStock?.high}</span> {/* sneaky sneaky error */}
		</div>
	)
}
```

App is running live on prod and the value meant to be rendered just is not there. That ain't good. We need TypeScript.

I've tried just about every GraphQL / TypeScript library under the sun and I really haven't found what I want. 
[GraphQL Codegen](https://www.the-guild.dev/graphql/codegen) is where my ventures have landed and I feel like it's kind of 'meh'.
The short explanation of codegen is this: It introspects your upstream schema, you run a command and it magically generates types 
and/or callable functions for the queries and mutations in your codebase. 
A little code example:

```
// Manually created and written and not type safe
// ~/queries/get-stock.graphql
query getStock($symbol: String!) {
  getStock(symbol: $symbol) {
    ask
    bid
  }
}


// Generated using GraphQL Codegen
// ~/generated/graphql.ts
// imagine all the generated types that are like the 
// typescript types for your graphql types here and for the next 800 lines
export const useGetStockQuery = (props) => {
  return useQuery<GetStockQueryResponse, GetStockVariables>(getStockQuery, {
    variables: { ...props.variables }
  })
}
```


I realize that might be hard to decipher so let's break it down a little:
1. We created a file with our `getStock` query
2. We ran the graphql codegen CLI. It translated and created the types from the schema to TypeScript. Plus it created the types for our query
response, as well as the types for our query input variables.

Not bad, fairly nice. Let's try an implementation:

```
// ~/components/GetStockBidAsk.component.tsx
import { useGetStockQuery } from '~/generated/graphql'

const GetStockAskBid = () => {
  const { data } = useGetStockQuery({
    variables: {
      symbol: "AAPL"
    }
  })

  return <div>{data?.getStock?.high}</div> 
  {/* sweeet, we got a TS error right in our editor. 
	 'high' does not exist on GetStockQueryResponse */}
}
```

What's good?
- Good: It wrote a function for us that makes our GraphQL query callable
- Good: we have type safe input and response for that function.

Is all that gravy? Not so fast, I see some issues here..
- Bad: We imported our query function from a generated file, so who knows where the query was actually written
- Bad: We can't use 'go-to definition' on the function call in our editor to modify the original query, because well, it's in a different directory.

I have to say, the scalability in terms of maintaining this approach is not fun. As soon as the codebase is 
over like 10 queries, it's a maze just to update one. At least for us who use LSP's 'go-to definition' as a primary way to navigate our codebases.

Now before totally rejecting codegen for those problems, I still prefer having type safety and navigating the maze of the codebase,
than not. As a tool, it offers a ton of configuration that can help remedy the problems above. Despite the docs being bad, you can
configure it to be almost really nice.

## 
My preferred set up right now is to use the [near-operation-file-preset plugin](https://www.the-guild.dev/graphql/codegen/plugins/presets/near-operation-file-preset):
and have a directory like this:
```
.. ~/components/get-stock/
   |-- get-stock.graphql
   |-- get-stock.generated.ts
   `-- get-stock.component.tsx
```

I do this so the generated response and variable types are put next to the query and the query
lives with the component. Keep it all scoped together, ya know. It's still not particularly great
in my workflow, but I certainly prefer it over the first implementation. If you really want my
ideas on how to solve the problem, check this out: [gql-bday-wish]("https://rsbear.sh/thoughts/gql-bday-wish").

The final config using react-query:
```yaml
overwrite: true
schema: 
  - "http://localhost:3000/api/graphql"
documents: "**/*.graphql"
generates:
  ./src/cells/types.ts:
    plugins:
      - typescript
  ./src/cells/:
    preset: near-operation-file
    presetConfig:
      extension: .generated.ts
      baseTypesPath: types.ts
    plugins:
      - typescript-operations
      - typescript-react-query
    config:
      pureMagicComment: true # enforce tree shaking
      exposeQueryKeys: true # enables .getKey() from react-query
      exposeFetcher: true
      fetcher: $utils/react-query-fetcher#fetcher
```

Or sometimes if I can use SWR instead of react-query..
```yaml
overwrite: true
schema: 
  - "http://localhost:3000/api/graphql"
documents: "**/*.graphql"
generates:
  ./src/cells/types.ts:
    plugins:
      - typescript
  ./src/cells/:
    preset: near-operation-file
    presetConfig:
      extension: .generated.ts
      baseTypesPath: types.ts
    plugins:
      - typescript-operations
```

and here's the type safe hook I wrote. The way it works is: pass in generated typed document node
to useGQL, it infers the input variables and response types from that declaration.
```
// ~/utils/use-gql.util.ts
import useSWR, { SWRConfiguration } from 'swr'
import { request } from 'graphql-request'

import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { DocumentNode, print } from 'graphql'

const fetcher = async (query: DocumentNode, variables?: unknown) => {
  const res = await fetch('https://localhost:3000/api/graphql', {
    method: 'POST',
    ...{ headers: { 'Content-Type': 'application/json' } },
    body: JSON.stringify({ query: print(query), variables }),
  })

  const json = await res.json()

  if (json.errors) throw new Error(json.errors[0])

  return json.data
}

interface GQLArgsClient<Data = any, Variables = unknown> {
  query: DocumentNode | TypedDocumentNode<Data, Variables>
  variables?: Variables
  options?: SWRConfiguration
}

export function useGQL<D = any, V = unknown>(args: GQLArgsClient<D, V>) {
  const swr = useSWR<D>([args.query, args.variables], fetcher, {
    ...args.options,
    dedupingInterval: 1000 * 35, //ms // this prevents duplicate requests while polling
  })
  return swr
}
```

