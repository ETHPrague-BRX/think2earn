import { BigInt } from "@graphprotocol/graph-ts";
import {
  Think2Earn,
  BountyCreated,
  EEGDataSubmitted,
  BountyCompleted,
  EtherDeposited,
  PaymentMade
} from "../generated/Think2Earn/Think2Earn";
import { Bounty, Submission, Deposit, Payment, User } from "../generated/schema";

export function handleBountyCreated(event: BountyCreated): void {
  let bounty = new Bounty(event.params.bountyId.toString());
  bounty.name = event.params.name;
  bounty.description = event.params.description;
  bounty.mediaURI = event.params.mediaURI;
  bounty.reward = event.params.reward;
  bounty.duration = event.params.duration;
  bounty.judgeTime = event.params.judgeTime;
  bounty.maxProgress = event.params.maxProgress;
  bounty.creator = event.params.creator;
  bounty.creationBlock = event.block.number;
  bounty.isActive = true;
  bounty.numAcceptedSubmissions = BigInt.fromI32(1) ;

  bounty.save();
}

export function handleEEGDataSubmitted(event: EEGDataSubmitted): void {
  let submissionId = event.params.bountyId.toString() + "-" + event.params.submissionId.toString();
  let submission = new Submission(submissionId);
  submission.bounty = event.params.bountyId.toString();
  submission.submitter = event.params.submitter;
  submission.eegDataHash = event.params.eegDataHash;
  submission.save();
}

export function handleBountyCompleted(event: BountyCompleted): void {
  let bounty = Bounty.load(event.params.bountyId.toString());
  if (bounty !== null) {
    bounty.isActive = false;
    bounty.save();
  }
}

export function handleEtherDeposited(event: EtherDeposited): void {
  let deposit = new Deposit(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  deposit.sender = event.params.sender;
  deposit.amount = event.params.amount;
  deposit.save();
}

export function handlePaymentMade(event: PaymentMade): void {
  let paymentId = event.params.bountyId.toString() + "-" + event.params.submissionId.toString();
  let payment = new Payment(paymentId);
  payment.bounty = event.params.bountyId.toString();
  payment.submission = event.params.submissionId.toString();
  payment.amount = event.params.amount;
  payment.save();
}
