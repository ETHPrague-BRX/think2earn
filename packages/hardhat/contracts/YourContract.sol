// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract YourContract is Ownable, ReentrancyGuard {
    struct Submission {
        address submitter;
        bytes32 mediaURIHash;   // Hash of the media URI
        bytes32 eegDataHash;    // Hash of the EEG data
        uint256 tokenReward;
        bool isPaid;
        bool eegDataSubmitted;  // Indicates if EEG data has been submitted
    }

    struct Bounty {
        string name;
        string description;     // IPFS hash or YouTube link
        uint256 reward;
        uint256 duration;       // in blocks
        uint256 judgeTime;      // in blocks
        uint256 maxProgress;    // max number of participants
        address creator;
        uint256 creationBlock;
        bool isActive;
    }

    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => Bounty) public bounties;
    uint256 public submissionCount = 1; // Start counting submissions from 1
    uint256 public bountyCount = 1;     // Start counting bounties from 1

    event MediaSent(uint256 indexed submissionId, bytes32 mediaURIHash, address indexed recipient);
    event EEGDataSubmitted(uint256 indexed submissionId, bytes32 eegDataHash);
    event EtherDeposited(address indexed sender, uint256 amount);
    event PaymentMade(uint256 indexed submissionId, uint256 amount);
    event BountyCreated(uint256 indexed bountyId, string name, string description, uint256 reward, uint256 duration, uint256 judgeTime, uint256 maxProgress, address indexed creator);
    event BountyCompleted(uint256 indexed bountyId, address indexed winner);

    constructor(address initialOwner) {
        transferOwnership(initialOwner);
    }

    receive() external payable {
        emit EtherDeposited(msg.sender, msg.value);
    }

    function sendMedia(uint256 _submissionId, bytes32 _mediaURIHash) external onlyOwner {
        require(_mediaURIHash != 0, "Invalid media hash");
        require(submissions[_submissionId].mediaURIHash == 0, "Submission ID already used");

        submissions[_submissionId] = Submission({
            submitter: address(0),
            mediaURIHash: _mediaURIHash,
            eegDataHash: 0,
            tokenReward: 0,
            isPaid: false,
            eegDataSubmitted: false
        });
        emit MediaSent(_submissionId, _mediaURIHash, msg.sender);
    }

    function submitEEGData(uint256 _submissionId, bytes32 _eegDataHash) external {
        Submission storage submission = submissions[_submissionId];
        require(submission.mediaURIHash != 0, "Invalid submission ID");
        require(!submission.eegDataSubmitted, "EEG data already submitted");
        require(_eegDataHash != 0, "Invalid EEG data hash");

        submission.submitter = msg.sender;
        submission.eegDataHash = _eegDataHash;
        submission.eegDataSubmitted = true;
        emit EEGDataSubmitted(_submissionId, _eegDataHash);
    }

    function approveAndPay(uint256 _submissionId, address _submitterAddress) external onlyOwner nonReentrant {
        Submission storage submission = submissions[_submissionId];
        require(submission.submitter == _submitterAddress, "Submission ID and address do not match");
        require(submission.submitter != address(0), "Submission not found");
        require(!submission.isPaid, "Already paid");
        require(submission.eegDataSubmitted, "EEG data not submitted");

        submission.isPaid = true;
        (bool sent, ) = submission.submitter.call{value: submission.tokenReward}("");
        require(sent, "Failed to send Ether");

        emit PaymentMade(_submissionId, submission.tokenReward);
    }

    function setReward(uint256 _submissionId, uint256 _reward) external onlyOwner {
        Submission storage submission = submissions[_submissionId];
        require(!submission.isPaid, "Already paid");
        submission.tokenReward = _reward;
    }

    function withdrawEther(address payable _to, uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function createBounty(
        string memory _name,
        string memory _description,
        uint256 _reward,
        uint256 _duration,
        uint256 _judgeTime,
        uint256 _maxProgress
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Bounty name cannot be empty");
        require(bytes(_description).length > 0, "Bounty description cannot be empty");
        require(_reward > 0, "Bounty reward must be greater than zero");
        require(_duration > 0, "Bounty duration must be greater than zero");

        bounties[bountyCount] = Bounty({
            name: _name,
            description: _description,
            reward: _reward,
            duration: _duration,
            judgeTime: _judgeTime,
            maxProgress: _maxProgress,
            creator: msg.sender,
            creationBlock: block.number,
            isActive: true
        });

        emit BountyCreated(bountyCount, _name, _description, _reward, _duration, _judgeTime, _maxProgress, msg.sender);
        bountyCount++;
    }

    function completeBounty(uint256 _bountyId, address _winner) external onlyOwner nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(block.number >= bounty.creationBlock + bounty.duration, "Bounty duration not yet passed");
        require(bounty.reward <= address(this).balance, "Insufficient contract balance to reward");

        bounty.isActive = false;
        (bool sent, ) = _winner.call{value: bounty.reward}("");
        require(sent, "Failed to send Ether");

        emit BountyCompleted(_bountyId, _winner);
    }

    function getBountyDetails(uint256 _bountyId) external view returns (
        string memory name,
        string memory description,
        uint256 reward,
        uint256 duration,
        uint256 judgeTime,
        uint256 maxProgress,
        address creator,
        uint256 creationBlock,
        bool isActive
    ) {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.name,
            bounty.description,
            bounty.reward,
            bounty.duration,
            bounty.judgeTime,
            bounty.maxProgress,
            bounty.creator,
            bounty.creationBlock,
            bounty.isActive
        );
    }
}
