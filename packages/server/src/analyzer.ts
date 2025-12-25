export function analyzeAll(crawlResult: Course[]) {
  return crawlResult.map((course) => {
    return {
      title: course.course.title,
      ...analyzeCourse(course),
    }
  })
}

function analyzeCourse(course: Course) {
  const problems = course.probsets.flatMap((p) => p.problems)
  const submissions = problems.flatMap((p) => p.submissions).filter((s) => s != undefined)
  let languageRecord = submissions.reduce(
    (acc, s) => {
      if (acc[s.language]) {
        acc[s.language]++
      } else {
        acc[s.language] = 1
      }
      return acc
    },
    {} as Record<string, number>,
  )
  languageRecord = Object.fromEntries(Object.entries(languageRecord).sort((a, b) => b[1] - a[1]))
  const submissionCount = submissions.length
  const submissionACCount = submissions.filter((s) => s.result === 'Accepted').length
  const submissionWACount = submissions.filter((s) => s.result === 'Wrong Answer').length
  const submissionTLECount = submissions.filter((s) => s.result === 'Time Out').length
  const submissionTestingCount = submissions.filter((s) => s.result === 'Testing').length
  const submissionCECount = submissions.filter((s) => s.result === 'Compile Error').length
  const submissionEOCount = submissions.filter((s) => s.result === 'Empty Output').length

  const midnightSubmission = submissions
    .map((s) => {
      const time = s.time
      const sortingHour = (time.getHours() - 5 + 24) % 24

      return {
        submission: s,
        sortingTime: sortingHour * 60 * 60 + time.getMinutes() * 60 + time.getSeconds(),
      }
    })
    .sort((a, b) => b.sortingTime - a.sortingTime)[0].submission

  const firstSubmission = submissions.sort((a, b) => a.time.valueOf() - b.time.valueOf())[0]

  const problemCount = problems.length
  const problemACCount = problems.filter((p) => p.status === 'AC').length
  const problemWACount = problems.filter((p) => p.status === 'WA').length
  const untaggedProblemsCount = problems.filter((p) => !p.status).length
  const allClears = course.probsets.filter((c) => c.problems.every((p) => p.status === 'AC'))
  const worstProbset = course.probsets
    .map((p) => {
      return {
        probset: p.probset,
        ac: p.problems.filter((p) => p.status === 'AC').length,
        total: p.problems.length,
        acRate: p.problems.filter((p) => p.status === 'AC').length / p.problems.length,
      }
    })
    .sort((a, b) => {
      if (a.acRate !== b.acRate) {
        return a.acRate - b.acRate
      } else {
        return b.total - a.total
      }
    })[0]

  const problemAnalysis = problems.map((p) => {
    return {
      title: p.title,
      probsetTitle: p.probsetTitle,
      status: p.status,
      submissionCount: p.submissions?.length ?? 0,
      acceptedCount: p.submissions?.filter((s) => s.result === 'Accepted').length ?? 0,
    }
  })
  const mostSubmittedProblem = problemAnalysis.sort(
    (a, b) => b.submissionCount - a.submissionCount,
  )[0]
  const mostAcceptedProblem = problemAnalysis.sort((a, b) => b.acceptedCount - a.acceptedCount)[0]

  return {
    probsets: {
      statistics: {
        total: course.probsets.length,
        allClear: allClears.length,
        allClearRate: allClears.length / course.probsets.length,
      },
      wowMoment: {
        probset: worstProbset.probset,
        total: worstProbset.total,
        ac: worstProbset.ac,
        acRate: worstProbset.acRate,
      },
    },
    problems: {
      statistics: {
        ac: problemACCount,
        wa: problemWACount,
        untagged: untaggedProblemsCount,
        total: problemCount,
        acRate: problemACCount / problemCount,
      },
      wowMoment: {
        mostSubmittedProblem: mostSubmittedProblem,
        mostAcceptedProblem: mostAcceptedProblem,
      },
    },
    submissions: {
      statistics: {
        total: submissionCount,
        ac: submissionACCount,
        wa: submissionWACount,
        tle: submissionTLECount,
        testing: submissionTestingCount,
        eo: submissionEOCount,
        ce: submissionCECount,
        acRate: submissionACCount / submissionCount,
      },
      wowMoment: {
        midnightSubmission: midnightSubmission,
        firstSubmission: firstSubmission,
      },
    },
    language: {
      statistics: languageRecord,
    },
  }
}
