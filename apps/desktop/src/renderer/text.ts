// Line endings and positions: the editor counts a line break as one character and joins lines
// with the separator it was given, while the kernel and the files hold the bytes as they are.

export type LineBreak = "\n" | "\r\n";

/**
 * The line break of a text: CRLF when every line break is CRLF; LF otherwise, and a mixed text says so.
 * Given either separator explicitly, the editor keeps every other byte as a character, so no text is
 * rewritten by being shown; the separator only decides what a typed line break inserts.
 */
export function lineBreakOf(text: string): { lineBreak: LineBreak; mixed: boolean } {
  const crlf = (text.match(/\r\n/g) ?? []).length;
  const lf = (text.match(/\n/g) ?? []).length;
  if (crlf > 0 && crlf === lf) return { lineBreak: "\r\n", mixed: false };
  return { lineBreak: "\n", mixed: crlf > 0 };
}

/** A string offset of a unit's text as a position of the editor's document. */
export function docPosition(text: string, offset: number, lineBreak: LineBreak): number {
  if (lineBreak === "\n") return offset;
  let breaks = 0;
  let i = text.indexOf("\r\n");
  while (i >= 0 && i < offset) {
    breaks += 1;
    i = text.indexOf("\r\n", i + 2);
  }
  return offset - breaks;
}
