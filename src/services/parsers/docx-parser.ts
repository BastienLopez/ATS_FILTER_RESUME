import mammoth from "mammoth";

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value ?? "";
}
