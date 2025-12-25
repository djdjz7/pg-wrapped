import { createClient, RequestClient } from './client'
import * as cheerio from 'cheerio'

export async function crawl(account: string, password: string, year: number) {
  const client = createClient()
  const loginResp = (
    await client.post<
      { success: true; token: string } | { success: false; errors: { code: string; msg: string } }
    >(
      'https://iaaa.pku.edu.cn/iaaa/oauthlogin.do',
      {
        appid: 'ProgrammingGrid',
        userName: account,
        password,
        redirUrl: 'https://programming.pku.edu.cn/authcallback',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
  ).data
  if (!loginResp.success) {
    throw new Error('IAAA 登录失败：' + loginResp.errors.msg)
  }
  const pgAuth = await client.get('https://programming.pku.edu.cn/authcallback', {
    params: {
      token: loginResp.token,
    },
  })
  const pgAuth2 = await client.get('https://programming.pku.edu.cn/course/authcallback', {
    params: {
      token: loginResp.token,
    },
  })
  const accountPageUrl = pgAuth2.headers.location
  if (!accountPageUrl) {
    throw new Error('编程网格 SSO 登录失败：未能获取用户主页链接')
  }
  const accountPage = await client.get(accountPageUrl)
  const accountPageHtml = accountPage.data
  const $ = cheerio.load(accountPageHtml)
  const courses = $('.courses > .rbox.click')
    .map((_, el) => {
      const course = $(el)
      // <span>计算概论A 2024 李戈<i></i>2024<i><i>李戈</span>
      const courseTitleSpan = course.children().first()
      const courseName = (courseTitleSpan.children()[0].prev as unknown as Text).data
      if (courseName.includes(year.toString())) {
        return {
          id: course.attr('id')!,
          title: courseName,
        }
      }
    })
    .get()
  return await Promise.all(
    courses.map(async (course) => {
      const coursePage = await client.get(`/course/${course.id}/`)
      const coursePageHtml = coursePage.data
      const $ = cheerio.load(coursePageHtml)
      const probsets: Probset[] = $('.probset > div.rbox.click')
        .map((_, el) => {
          const title = $('.title', el).text().trim()
          const id = $(el).attr('id')
          const openTime = new Date($('.openTime', el).text().trim())
          const closeTime = new Date($('.closeTime', el).text().trim())
          if (title && id)
            return {
              title,
              id,
              openTime,
              closeTime,
            }
        })
        .get()
      return {
        course,
        probsets: (
          await Promise.all(probsets.map((probset) => crawlProbset(client, probset, account)))
        ).sort((a, b) => a.probset.openTime.valueOf() - b.probset.openTime.valueOf()),
      }
    }),
  )
}

async function crawlProbset(client: RequestClient, probset: Probset, account: string) {
  const probsetPage = await client.get(`/probset/${probset.id}/`)
  const probsetPageHtml = probsetPage.data
  const $ = cheerio.load(probsetPageHtml)
  const problems: Problem[] = $('.problem.rbox')
    .map((_, el) => {
      const title = $('.title', el).text()
      const id = $(el).attr('id')
      if (title && id)
        return {
          title,
          id,
          probsetTitle: probset.title,
        }
    })
    .get() as Problem[]
  const queryResult = await client.post<{
    results: {
      result: 'AC' | 'WA' | string
      id: string
    }[]
  }>(
    '/account/query.do',
    {
      query: 'results',
      probsetId: probset.id,
      username: account,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  for (const result of queryResult.data.results) {
    const problem = problems.find((p) => p.id === result.id)
    if (problem) {
      problem.status = result.result as 'WA' | 'AC'
      problem.submissions = await crawlHistory(
        client,
        probset.id,
        problem.id,
        account,
        probset.title,
        problem.title,
      )
    }
  }

  return {
    probset,
    problems,
  }
}

async function crawlHistory(
  client: RequestClient,
  probsetId: string,
  problemId: string,
  account: string,
  probsetTitle: string,
  problemTitle: string,
) {
  let page = 0
  let history: SubmissionHistory[] = []
  while (history.length === 20 * page) {
    page++
    const historyResponse = await client.get(`/probset/${probsetId}/${problemId}/history.do`, {
      params: {
        username: account,
        page,
      },
    })
    const historyHtml = historyResponse.data
    const $ = cheerio.load(historyHtml)
    history.push.apply(
      history,
      $('#listtable tr.li[id]')
        .map((_, el) => {
          const children = $(el).children()
          return {
            result: resultToText(children.eq(1).text().trim()),
            language: children.eq(2).text().trim(),
            time: new Date(children.eq(-1).text().trim()),
            problemTitle,
            probsetTitle,
          }
        })
        .get(),
    )
  }
  return history
}

function resultToText(result: string) {
  var map: Record<string, string> = {
    Passed: 'Accepted',
    SystemError: 'System Error',
    TimeOut: 'Time Out',
    OutOfMemory: 'Out Of Memory',
    RuntimeError: 'Runtime Error',
    OutputExceeded: 'Output Exceeded',
    WaitTimeOut: 'Wait Time Out',
    NoProblem: 'No Problem',
    NoTestData: 'No Test Data',
    WrongAnswer: 'Wrong Answer',
    CompileError: 'Compile Error',
    EmptyOutput: 'Empty Output',
    Testing: 'Testing',
  }
  var text = map[result]
  if (text == undefined) {
    return 'Processing'
  }
  return text
}
