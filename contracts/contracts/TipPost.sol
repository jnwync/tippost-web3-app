// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipPost {
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint256 likes;
        uint256 totalEarned;
        uint256 timestamp;
    }

    uint256 public postCount;
    uint256 public constant likeCost = 0.0001 ether;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    event PostCreated(
        uint256 indexed id,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );

    event PostLiked(
        uint256 indexed id,
        address indexed liker,
        address indexed creator,
        uint256 amount
    );

    function createPost(string calldata imageUrl, string calldata caption) external {
        require(bytes(imageUrl).length > 0, "Image URL required");
        require(bytes(caption).length > 0, "Caption required");

        postCount++;
        posts[postCount] = Post({
            id: postCount,
            creator: msg.sender,
            imageUrl: imageUrl,
            caption: caption,
            likes: 0,
            totalEarned: 0,
            timestamp: block.timestamp
        });

        emit PostCreated(postCount, msg.sender, imageUrl, caption, block.timestamp);
    }

    function likePost(uint256 id) external payable {
        require(id > 0 && id <= postCount, "Post does not exist");
        require(msg.value == likeCost, "Must send exactly 0.0001 ETH");
        require(!hasLiked[id][msg.sender], "Already liked");

        Post storage post = posts[id];
        require(msg.sender != post.creator, "Cannot like own post");

        // Checks-Effects-Interactions: update state before external call
        hasLiked[id][msg.sender] = true;
        post.likes++;
        post.totalEarned += msg.value;
        totalEarnedByUser[post.creator] += msg.value;

        (bool ok, ) = post.creator.call{value: msg.value}("");
        require(ok, "Transfer failed");

        emit PostLiked(id, msg.sender, post.creator, msg.value);
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    function checkLiked(uint256 id, address user) external view returns (bool) {
        return hasLiked[id][user];
    }
}
