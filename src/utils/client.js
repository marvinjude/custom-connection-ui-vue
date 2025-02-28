import { IntegrationAppClient } from "@integration-app/sdk";

export const getClient = async (accessToken) => {
  const client = new IntegrationAppClient({
    accessToken: accessToken,
  });
  return client;
};

export const sampleAccessToken =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwNGRkNDEzLWFlNGQtNGVjMS1hNGY3LWU2NTMzMjcxZjM2OCIsIm5hbWUiOiJKdWRlIG9uIERldiIsImlhdCI6MTc0MDc0OTU2MiwiZXhwIjoxNzQwNzU2NzYyLCJpc3MiOiI5NDk5YWJhMi1lN2Y5LTRhMzctODM3Mi0wOGMwNmRlNTRkZjYifQ.iaRyMFgJY7FYEdTuAcmCRsmVM2VCrV9SzgzXPll8k7Nu9K7NuGuvSAo3JIzAt6e9I-6ragprIlwqMV2afFBGjQ";
