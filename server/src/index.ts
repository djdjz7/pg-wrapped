import { Elysia, t } from "elysia";
import { crawl } from "./crawler";
import { analyzeAll } from "./analyzer";

const app = new Elysia()
  .post(
    "/",
    async ({ body: { account, password } }) => {
      const crawlResult =  await crawl(account, password);
      return analyzeAll(crawlResult);
    },
    {
      body: t.Object({
        account: t.String(),
        password: t.String(),
      }),
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
