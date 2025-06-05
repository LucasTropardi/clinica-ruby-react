export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/, (_, p1, p2, p3, p4) =>
    [p1, p2, p3].filter(Boolean).join('.') + (p4 ? `-${p4}` : '')
  );
}
