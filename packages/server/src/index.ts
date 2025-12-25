import { Elysia, InternalServerError, t } from 'elysia'
import { crawl } from './crawler'
import { analyzeAll } from './analyzer'

const app = new Elysia()
  .onError(({ error, status }) => {
    return status("I'm a teapot", {
      message: error.toString(),
    })
  })
  .post(
    '/',
    async ({ body: { account, password, year } }) => {
      const crawlResult = await crawl(account, password, year)
      return analyzeAll(crawlResult)
    },
    {
      body: t.Object({
        account: t.String(),
        password: t.String(),
        year: t.Number(),
      }),
    },
  )
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
