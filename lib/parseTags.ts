export function parseTags(input: string): string[] {
  return Array.from(new Set(input.split(/,|、/).map(tag => tag.trim()).filter(tag => tag)));
}
