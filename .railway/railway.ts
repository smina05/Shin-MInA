import { defineRailway, github, image, preserve, project, service, volume } from "railway/iac";

export const partial = "plant-observation";

export default defineRailway((ctx) => {
  const storage = volume("anythingllm-data");
  const anythingllm = service("anythingllm", {
    source: image("mintplexlabs/anythingllm:railway-1.19.0"),
    env: {
      PORT: "3001",
      STORAGE_DIR: "/storage",
      AUTH_TOKEN: preserve(),
    },
    volumeMounts: { "/storage": storage },
  });

  const web = service("plant-observation", {
    source: github("smina05/Shin-MInA", { branch: "main" }),
    start: "npm start",
    healthcheck: "/healthz",
    env: {
      ANYTHINGLLM_URL: "http://${{anythingllm.RAILWAY_PRIVATE_DOMAIN}}:3001",
      ANYTHINGLLM_API_KEY: preserve(),
      ANYTHINGLLM_WORKSPACE_SLUG: preserve(),
    },
  });

  return project(ctx.projectName ?? "plant-observation", {
    resources: [web, anythingllm, storage],
  });
});
