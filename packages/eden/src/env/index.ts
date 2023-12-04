import { z } from "zod";

const env = process.env;

const EnvironmentSchema = z.object({
  API_URL: z.string().url(),
});

const environment = {
  API_URL: env.API_URL!,
} satisfies z.infer<typeof EnvironmentSchema>;

if (!EnvironmentSchema.safeParse(environment))
  throw new Error(
    JSON.stringify({
      message: "Invalid Environment Variables",
      location: "@mydrive/eden",
    })
  );

export { environment as env };
