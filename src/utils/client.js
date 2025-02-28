import { IntegrationAppClient } from "@integration-app/sdk";

export const getClient = async (accessToken) => {
  const client = new IntegrationAppClient({
    accessToken: accessToken,
  });
  return client;
};

export const sampleAccessToken =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwNGRkNDEzLWFlNGQtNGVjMS1hNGY3LWU2NTMzMjcxZjM2OCIsIm5hbWUiOiJKdWRlIG9uIERldiIsImlhdCI6MTc0MDc1NzQwMywiZXhwIjoxNzQxMTAzMDAzLCJpc3MiOiI5NDk5YWJhMi1lN2Y5LTRhMzctODM3Mi0wOGMwNmRlNTRkZjYifQ.FIlAiv3UkIaoZ89hUlptA-EDAm8__po2ipvwhlIhh5lwnqOnXqClnWzzy_BclcKAbzJJOexx1lBx0W97CwyH2A";
