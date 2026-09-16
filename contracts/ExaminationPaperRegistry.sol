// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ExaminationPaperRegistry
 * @dev Cryptographic registry for examination paper hashes and distribution metadata.
 * The actual PDF is NEVER stored on-chain.
 */
contract ExaminationPaperRegistry {
    address public owner;

    struct Paper {
        string paperId;
        string examId;
        string sha256Hash;
        address issuer;
        uint256 registrationTimestamp;
        uint256 releaseTimestamp;
        string status; // "REGISTERED", "RELEASED", "REVOKED"
        string revocationReason;
    }

    mapping(string => Paper) private papers;
    string[] private paperList;

    event PaperRegistered(
        string indexed paperId,
        string indexed examId,
        string sha256Hash,
        address indexed issuer,
        uint256 releaseTimestamp
    );

    event PaperStatusUpdated(
        string indexed paperId,
        string newStatus
    );

    event PaperRevoked(
        string indexed paperId,
        string reason,
        address revoker,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerPaper(
        string memory _paperId,
        string memory _examId,
        string memory _sha256Hash,
        uint256 _releaseTimestamp
    ) external {
        require(bytes(papers[_paperId].paperId).length == 0, "Paper already registered");
        require(bytes(_sha256Hash).length == 64, "Invalid SHA-256 hash length");

        papers[_paperId] = Paper({
            paperId: _paperId,
            examId: _examId,
            sha256Hash: _sha256Hash,
            issuer: msg.sender,
            registrationTimestamp: block.timestamp,
            releaseTimestamp: _releaseTimestamp,
            status: "REGISTERED",
            revocationReason: ""
        });

        paperList.push(_paperId);

        emit PaperRegistered(
            _paperId,
            _examId,
            _sha256Hash,
            msg.sender,
            _releaseTimestamp
        );
    }

    function verifyPaper(
        string memory _paperId,
        string memory _sha256Hash
    ) external view returns (bool matches, string memory status, uint256 registeredAt, string memory storedHash) {
        Paper memory p = papers[_paperId];
        require(bytes(p.paperId).length > 0, "Paper not found on blockchain");

        bool hashMatch = (keccak256(abi.encodePacked(p.sha256Hash)) == keccak256(abi.encodePacked(_sha256Hash)));
        return (hashMatch, p.status, p.registrationTimestamp, p.sha256Hash);
    }

    function revokePaper(
        string memory _paperId,
        string memory _reason
    ) external {
        require(bytes(papers[_paperId].paperId).length > 0, "Paper not found");
        papers[_paperId].status = "REVOKED";
        papers[_paperId].revocationReason = _reason;

        emit PaperRevoked(_paperId, _reason, msg.sender, block.timestamp);
    }

    function updatePaperStatus(
        string memory _paperId,
        string memory _newStatus
    ) external {
        require(bytes(papers[_paperId].paperId).length > 0, "Paper not found");
        papers[_paperId].status = _newStatus;

        emit PaperStatusUpdated(_paperId, _newStatus);
    }

    function getPaper(string memory _paperId) external view returns (Paper memory) {
        require(bytes(papers[_paperId].paperId).length > 0, "Paper not found");
        return papers[_paperId];
    }

    function getTotalPapers() external view returns (uint256) {
        return paperList.length;
    }
}
