export function generateAvailableSlots(): string[] {
  const slots: string[] = [];

  const addSlots = (startHour: number, endHour: number) => {
    for (let h = startHour; h <= endHour; h++) {
      slots.push(`${pad(h)}:00`);
      slots.push(`${pad(h)}:30`);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  addSlots(8, 11); // manhã: 08:00–11:30
  addSlots(14, 17); // tarde: 14:00–17:30

  return slots;
}

// Remove horários já ocupados
export function getFreeSlots(allSlots: string[], occupiedSlots: string[]): string[] {
  const occupiedSet = new Set(occupiedSlots.map(t => t.trim()));
  return allSlots.filter(slot => !occupiedSet.has(slot));
}
