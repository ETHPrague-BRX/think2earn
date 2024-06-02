export type Submission = {
  id: string;
  submitter: string;
  eegDataHash: string;
};

export type Bounty = {
  title: string;
  description: string;
  creator: string;
  reward: number;
  duration: string;
  maxProgress: number;
  progress: number;
  submissions: Submission[];
};
