import { app } from "./app";
import { env } from "./utils/env";

app.listen(env.port, (): void => {
  console.log(`CronoCapsula API running on port ${env.port}`);
  console.log(`Swagger docs available at ${env.backendUrl}/api-docs`);
});
