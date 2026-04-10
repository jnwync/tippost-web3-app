import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import type { TipPost } from "../typechain-types";

const LIKE_COST = hre.ethers.parseEther("0.0001");

async function deployTipPost() {
  const [owner, alice, bob] = await hre.ethers.getSigners();
  const TipPostFactory = await hre.ethers.getContractFactory("TipPost");
  const contract = (await TipPostFactory.deploy()) as unknown as TipPost;
  return { contract, owner, alice, bob };
}

describe("TipPost", function () {
  // ── Test 1: createPost ────────────────────────────────────────────────────
  describe("createPost", function () {
    it("stores the post and emits PostCreated with correct fields", async function () {
      const { contract, alice } = await loadFixture(deployTipPost);

      const imageUrl = "https://picsum.photos/600/400";
      const caption = "Hello Web3";

      await expect(contract.connect(alice).createPost(imageUrl, caption))
        .to.emit(contract, "PostCreated")
        .withArgs(1n, alice.address, imageUrl, caption, (ts: bigint) => ts > 0n);

      const posts = await contract.getAllPosts();
      expect(posts).to.have.length(1);
      expect(posts[0].id).to.equal(1n);
      expect(posts[0].creator).to.equal(alice.address);
      expect(posts[0].imageUrl).to.equal(imageUrl);
      expect(posts[0].caption).to.equal(caption);
      expect(posts[0].likes).to.equal(0n);
      expect(posts[0].totalEarned).to.equal(0n);
    });

    it("reverts when imageUrl is empty", async function () {
      const { contract, alice } = await loadFixture(deployTipPost);
      await expect(
        contract.connect(alice).createPost("", "caption")
      ).to.be.revertedWith("Image URL required");
    });

    it("reverts when caption is empty", async function () {
      const { contract, alice } = await loadFixture(deployTipPost);
      await expect(
        contract.connect(alice).createPost("https://picsum.photos/600/400", "")
      ).to.be.revertedWith("Caption required");
    });
  });

  // ── Test 2: likePost — successful tip ────────────────────────────────────
  describe("likePost — successful tip", function () {
    it("transfers ETH to creator, increments likes, and emits PostLiked", async function () {
      const { contract, alice, bob } = await loadFixture(deployTipPost);

      await contract.connect(alice).createPost("https://picsum.photos/600/400", "Hi");

      const tx = contract.connect(bob).likePost(1n, { value: LIKE_COST });
      await expect(tx)
        .to.emit(contract, "PostLiked")
        .withArgs(1n, bob.address, alice.address, LIKE_COST);
      await expect(tx)
        .to.changeEtherBalances([bob, alice], [-LIKE_COST, LIKE_COST]);

      const posts = await contract.getAllPosts();
      expect(posts[0].likes).to.equal(1n);
      expect(posts[0].totalEarned).to.equal(LIKE_COST);

      const earned = await contract.totalEarnedByUser(alice.address);
      expect(earned).to.equal(LIKE_COST);
    });
  });

  // ── Test 3: reject double-like ────────────────────────────────────────────
  describe("likePost — double-like prevention", function () {
    it("reverts when the same address likes a post twice", async function () {
      const { contract, alice, bob } = await loadFixture(deployTipPost);

      await contract.connect(alice).createPost("https://picsum.photos/600/400", "Hi");
      await contract.connect(bob).likePost(1n, { value: LIKE_COST });

      await expect(
        contract.connect(bob).likePost(1n, { value: LIKE_COST })
      ).to.be.revertedWith("Already liked");
    });
  });

  // ── Test 4: reject self-like ──────────────────────────────────────────────
  describe("likePost — self-like prevention", function () {
    it("reverts when the creator tries to like their own post", async function () {
      const { contract, alice } = await loadFixture(deployTipPost);

      await contract.connect(alice).createPost("https://picsum.photos/600/400", "Hi");

      await expect(
        contract.connect(alice).likePost(1n, { value: LIKE_COST })
      ).to.be.revertedWith("Cannot like own post");
    });
  });

  // ── Test 5: insufficient ETH guard ───────────────────────────────────────
  describe("likePost — payment validation", function () {
    it("reverts when sent ETH is below likeCost", async function () {
      const { contract, alice, bob } = await loadFixture(deployTipPost);

      await contract.connect(alice).createPost("https://picsum.photos/600/400", "Hi");

      await expect(
        contract.connect(bob).likePost(1n, { value: hre.ethers.parseEther("0.00001") })
      ).to.be.revertedWith("Must send exactly 0.0001 ETH");
    });
  });

  // ── Test 6: non-existent post guard ──────────────────────────────────────
  describe("likePost — post existence", function () {
    it("reverts when post id does not exist", async function () {
      const { contract, bob } = await loadFixture(deployTipPost);

      await expect(
        contract.connect(bob).likePost(99n, { value: LIKE_COST })
      ).to.be.revertedWith("Post does not exist");
    });
  });

  // ── getAllPosts — empty state ─────────────────────────────────────────────
  describe("getAllPosts", function () {
    it("returns empty array on fresh deployment", async function () {
      const { contract } = await loadFixture(deployTipPost);
      expect(await contract.getAllPosts()).to.have.length(0);
    });
  });

  // ── checkLiked ────────────────────────────────────────────────────────────
  describe("checkLiked", function () {
    it("returns false before liking and true after", async function () {
      const { contract, alice, bob } = await loadFixture(deployTipPost);

      await contract.connect(alice).createPost("https://picsum.photos/600/400", "Hi");

      expect(await contract.checkLiked(1n, bob.address)).to.be.false;
      await contract.connect(bob).likePost(1n, { value: LIKE_COST });
      expect(await contract.checkLiked(1n, bob.address)).to.be.true;
    });
  });
});
