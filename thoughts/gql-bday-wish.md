---
id: 9037820p1jfsd9f893028402184
title: A little wish for what GraphQL was on the frontend.
desc: Please gql-codegen team, make this..
slug: gql-bday-wish
created: April 14, 2022
year: 2022
repo:
---

GraphQL on the frontend, it's nice - clear, concise, and in classic GraphQL fashion, self documenting.
That's great and all, but since it's a different language you can just forget about leveraging TypeScript.
And well that, that sucks. Let's take a look at a basic example.

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
		variables: { currency: "USD", symbol: "NVDA" }
	})

	return (
	  <div>
		  <h3>NVDA Ask</h3>
      <span>{data?.getStock?.high}</span> {/* sneaky sneaky error */}
		</div>
	)
}


```

App is running live on prod and the value meant to be rendered just is not there. That ain't good.

I've tried just about every GraphQL / TypeScript library under the sun and I really haven't found what I want.

