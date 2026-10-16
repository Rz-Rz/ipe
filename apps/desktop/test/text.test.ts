// The editor's line endings and positions (SPEC-PRJ-001 limit case, SPEC-PRJ-006): what the editor
// gives back is what it was given, and a kernel offset lands on the right character.
import { describe, expect, it } from "vitest";
import { docPosition, lineBreakOf } from "../src/renderer/text.js";

describe("line endings in the editor", () => {
  it("detects a uniform CRLF text, keeps LF otherwise, and names a mixed text", () => {
    expect(lineBreakOf("a\r\nb\r\n")).toEqual({ lineBreak: "\r\n", mixed: false });
    expect(lineBreakOf("a\nb\n")).toEqual({ lineBreak: "\n", mixed: false });
    expect(lineBreakOf("no line break")).toEqual({ lineBreak: "\n", mixed: false });
    expect(lineBreakOf("a\r\nb\nc")).toEqual({ lineBreak: "\n", mixed: true });
  });

  it("maps a string offset to a document position, one character per line break", () => {
    const text = "ab\r\ncd\r\nef";
    expect(docPosition(text, 0, "\r\n")).toBe(0);
    expect(docPosition(text, 4, "\r\n")).toBe(3);
    expect(docPosition(text, 8, "\r\n")).toBe(6);
    expect(docPosition(text, 10, "\r\n")).toBe(8);
    expect(docPosition("a\nb", 2, "\n")).toBe(2);
  });
});
