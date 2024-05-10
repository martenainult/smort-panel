export function sanitizeJSON(unsanitized: string): string {
  return unsanitized.replace(/\n/g, '').replace('\0', '')
}
