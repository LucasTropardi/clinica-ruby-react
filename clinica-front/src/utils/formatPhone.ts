// utils/formatPhone.ts
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11); // Limita a 11 dígitos (2 DDD + 9 número)

  if (digits.length <= 10) {
    // (99) 9999-9999
    return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/, (_, ddd, part1, part2) => {
      let result = '';
      if (ddd) result += `(${ddd})`;
      if (part1) result += ` ${part1}`;
      if (part2) result += `-${part2}`;
      return result;
    });
  }

  // (99) 99999-9999
  return digits.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})$/, (_, ddd, part1, part2) => {
    let result = '';
    if (ddd) result += `(${ddd})`;
    if (part1) result += ` ${part1}`;
    if (part2) result += `-${part2}`;
    return result;
  });
}
