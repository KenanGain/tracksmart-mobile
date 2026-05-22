/**
 * Mock backend — Home-screen lists.
 *
 * Backend side of the mockup. The frontend reaches these through
 * `lib/api/home.ts`. Both lists are empty for now, so the Home screen
 * shows their empty states.
 */
export type Payroll = {
  id: string;
  period: string;
  amount: string;
};

export type Shift = {
  id: string;
  label: string;
  /** ISO datetime. */
  startsAt: string;
};

export const payrolls: Payroll[] = [];
export const shifts: Shift[] = [];
