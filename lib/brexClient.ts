import type { User, Money } from "@/lib/sharedTypes";

interface BrexClientOptions {
  apiKey: string;
  staging: boolean;
}

type FetchOptions = {
  method?: string;
  body?: any;
};

type ListUsersQueryOptions = {
  cursor?: string | null;
  limit?: number | null;
  email?: string | null;
};

type UpdateUsersQueryOptions = {
  id?: string;
  status?: string;
  manager_id?: string;
  department_id?: string;
  location_id?: string;
};

type InviteUserQueryOptions = {
  first_name: string;
  last_name: string;
  email: string;
  manager_id: string;
  department_id: string;
  location_id: string;
};

type SetUserLimitOptions = {
  id: string;
  amount: string;
  currency?: string;
};

/* Removes falsy values from maps of strings or numbers and converts all values to strings */
const cleanStringsMap = (obj: {
  [key in string]: number | string | undefined | null;
}) => {
  const dir: {
    [key in string]: string;
  } = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value) {
      dir[key] = String(value);
    }
  });

  return dir;
};

export default class BrexClient {
  apiKey: string;
  url: string;

  constructor(options: BrexClientOptions) {
    if (!options.apiKey) {
      throw new Error("API key not found");
    }

    this.apiKey = options.apiKey;
    this.url = options.staging
      ? "https://platform.staging.brexapps.com"
      : "https://platform.brexapis.com";
  }

  private fetchData = async <T = unknown>(
    route: string,
    options?: FetchOptions
  ): Promise<T> => {
    const resp_raw = await fetch(`${this.url}${route}`, {
      method: options?.method ?? "GET",
      body: JSON.stringify(options?.body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const data = await resp_raw.json();

    return data;
  };

  users = {
    list: async (options?: ListUsersQueryOptions): Promise<User[]> => {
      const query = options
        ? new URLSearchParams(cleanStringsMap(options))
        : "";
      return this.fetchData(`/v2/users?${query}`);
    },

    current: async (): Promise<User> => {
      return this.fetchData(`/v2/users/me`);
    },

    user: async (id: string): Promise<User> => {
      return this.fetchData(`/v2/users/${id}`);
    },

    invite: async (options: InviteUserQueryOptions): Promise<User> => {
      return this.fetchData(`/v2/users`, {
        method: "POST",
        body: cleanStringsMap(options),
      });
    },

    getLimit: async (id: string): Promise<User> => {
      return this.fetchData(`/v2/users/${id}/limit`);
    },

    setLimit: async (options: SetUserLimitOptions): Promise<User> => {
      return this.fetchData(`/v2/users/${options.id}/limit`, {
        method: "PUT",
        body: cleanStringsMap({
          amount: options.amount,
          currency: options.currency,
        }),
      });
    },

    update: async (options: UpdateUsersQueryOptions): Promise<User> => {
      return this.fetchData(`/v2/users/${options.id}`, {
        method: "PUT",
        body: cleanStringsMap({
          status: options.status,
          manager_id: options.manager_id,
          department_id: options.department_id,
          location_id: options.location_id,
        }),
      });
    },
  };
}
