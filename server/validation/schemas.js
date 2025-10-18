import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(4, 'Password must be at least 4 characters long')
});

export const calculationSchema = z.object({
  project_name: z.string().trim().min(1, 'Project name is required'),
  project_description: z.string().trim().nullable().optional(),
  buying_price_usd: z.coerce.number().min(0, 'Buying price must be zero or greater'),
  selling_price_eur: z.coerce.number().min(0, 'Selling price must be zero or greater'),
  working_days: z.coerce.number().int().min(1, 'Working days must be at least 1'),
  exchange_rate: z.coerce.number().positive('Exchange rate must be positive'),
  calculation_date: z.string().trim().min(1, 'Calculation date is required'),
  commission_eur: z.coerce.number().optional()
});
