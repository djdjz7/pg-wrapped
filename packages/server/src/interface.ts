interface Probset {
  title: string;
  id: string;
  openTime: Date;
  closeTime: Date;
}

interface Problem {
  title: string;
  probsetTitle: string;
  id: string;
  status: "WA" | "AC" | string | undefined;
  submissions: SubmissionHistory[] | undefined;
}

interface Course {
  course: {
    id: string;
    title: string;
  };
  probsets: {
    probset: Probset;
    problems: Problem[];
  }[];
}

interface SubmissionHistory {
  result: string;
  time: Date;
  language: string;
  problemTitle: string;
  probsetTitle: string;
}
