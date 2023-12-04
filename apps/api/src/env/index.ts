import { env } from "bun";
import { z } from "zod";

const EnvironmentSchema = z.object({
  PORT: z.number().positive(),
  DATABASE_URL: z.string().url(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

const environment = {
  PORT: parseInt(env.PORT!),
  DATABASE_URL: env.DATABASE_URL!,

  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET!,
} satisfies z.infer<typeof EnvironmentSchema>;

const result = EnvironmentSchema.safeParse(environment);

if (!result.success) throw new Error("Invalid Environment Variables");

export { environment as env };
