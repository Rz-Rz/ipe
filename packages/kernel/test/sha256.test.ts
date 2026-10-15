// The pure SHA-256 against the standard vectors, and differentially against the platform's digest
// on random strings, Unicode included: the kernel's content addressing must match any other reader's.
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { sha256Hex } from "../src/index.js";
import { Random } from "./support/random.js";

describe("sha256Hex", () => {
  it("matches the standard vectors", () => {
    expect(sha256Hex("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(sha256Hex("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).toBe("248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1");
  });

  it("agrees with the platform digest on random strings, including multi-byte characters", () => {
    const rnd = new Random(7);
    const alphabet = ["a", "z", " ", "é", "漢", "😀", "\n", "0"];
    for (let i = 0; i < 200; i++) {
      let s = "";
      const length = rnd.int(0, 300);
      for (let j = 0; j < length; j++) s += rnd.pick(alphabet);
      expect(sha256Hex(s)).toBe(createHash("sha256").update(s, "utf8").digest("hex"));
    }
  });
});
