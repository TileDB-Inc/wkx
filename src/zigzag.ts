export function encode(value: number): number {
  return (value << 1) ^ (value >> 31);
}

export function decode(value: number): number {
  return (value >> 1) ^ (-(value & 1));
}

