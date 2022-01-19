export const get = async <T = unknown>(route: string): Promise<T> => {
  const resp_raw = await fetch(
    `https://platform.staging.brexapps.com${route}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BREX_API_KEY}`,
      },
    }
  );

  const data = await resp_raw.json();

  return data;
};

export const post = async <T = unknown>(
  route: string,
  body: any
): Promise<T> => {
  const resp_raw = await fetch(
    `https://platform.staging.brexapps.com${route}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BREX_API_KEY}`,
      },
    }
  );

  const data = await resp_raw.json();

  return data;
};

export default {
  get,
  post,
};
