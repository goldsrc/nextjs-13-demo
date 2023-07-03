export const getApiPath = (
  relativePath: string,
  params?: Record<string, unknown>,
) => {
  const {INTERNAL_API_URL = 'http://localhost:3000'} = process.env;
  const url = new URL(`${INTERNAL_API_URL}${relativePath}`);
  if (params) url.search = paramstoSearchParams(params).toString();
  return url.toString();
};

const paramstoSearchParams = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    searchParams.set(
      key,
      typeof value === 'object'
        ? Array.isArray(value)
          ? value.join(',')
          : JSON.stringify(value)
        : String(value),
    );
  }
  return searchParams;
};
