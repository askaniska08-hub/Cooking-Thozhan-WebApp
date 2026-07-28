export function pluralize(n: number, singular: string, plural?: string) {
  if (n === 1) return `${n} ${singular}`;
  return `${n} ${plural ?? singular + 's'}`;
}

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
