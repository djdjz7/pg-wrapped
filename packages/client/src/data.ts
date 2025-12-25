export interface Course {
  title: string
  probsets: Probsets
  problems: Problems
  submissions: Submissions
  language: Language
}

export interface Probsets {
  statistics: Statistics
  wowMoment: WowMoment
}

export interface Statistics {
  total: number
  allClear: number
  allClearRate: number
}

export interface WowMoment {
  probset: Probset
  total: number
  ac: number
  acRate: number
}

export interface Probset {
  title: string
  id: string
  openTime: string
  closeTime: string
}

export interface Problems {
  statistics: Statistics2
  wowMoment: WowMoment2
}

export interface Statistics2 {
  ac: number
  wa: number
  untagged: number
  total: number
  acRate: number
}

export interface WowMoment2 {
  mostSubmittedProblem: MostSubmittedProblem
  mostAcceptedProblem: MostAcceptedProblem
}

export interface MostSubmittedProblem {
  title: string
  probsetTitle: string
  status: string
  submissionCount: number
  acceptedCount: number
}

export interface MostAcceptedProblem {
  title: string
  probsetTitle: string
  status: string
  submissionCount: number
  acceptedCount: number
}

export interface Submissions {
  statistics: Statistics3
  wowMoment: WowMoment3
}

export interface Statistics3 {
  total: number
  ac: number
  wa: number
  tle: number
  testing: number
  eo: number
  ce: number
  acRate: number
}

export interface WowMoment3 {
  midnightSubmission: MidnightSubmission
  firstSubmission: FirstSubmission
}

export interface MidnightSubmission {
  result: string
  language: string
  time: string
  problemTitle: string
  probsetTitle: string
}

export interface FirstSubmission {
  result: string
  language: string
  time: string
  problemTitle: string
  probsetTitle: string
}

export interface Language {
  statistics: Statistics4
}

export interface Statistics4 {
  'C++': number
  Python: number
}
