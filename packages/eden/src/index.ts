import type { Api } from "@mydrive/api";
import { edenFetch, edenTreaty } from "@elysiajs/eden";

export const client = edenTreaty<Api>("http://127.0.0.1:8080");
export const fetch = edenFetch<Api>("http://127.0.0.1:8080");
