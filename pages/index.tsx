import api from "@/lib/api";
import Head from "next/head";
import * as React from "react";
import cx from "classnames";
import BrexClient from "@/lib/brexClient";
import type { GetServerSidePropsContext, NextPage } from "next";

const client = new BrexClient({
  apiKey: process.env.BREX_API_KEY ?? "",
  staging: true,
});

const Home: NextPage<{ data: any }> = ({ data }) => {
  const [users, setUsers] = React.useState<any[]>(data.items);

  if (!data) {
    return <p>loading</p>;
  }

  return (
    <div>
      <Head>
        <title>Brex Power User Starter App | Users</title>
        <meta name="description" content="Make bulk changes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul className="grid grid-cols-4 gap-2">
        {users.map((user: any) => (
          <li
            className={cx(
              "border-1 rounded-md p-4 overflow-hidden relative min-h-36",
              {
                "bg-green-100": user.status === "ACTIVE",
                "bg-red-300": user.status === "DISABLED",
              }
            )}
            key={user.id}
          >
            <p>
              {user.first_name} {user.last_name}
            </p>
            <p>{user.status}</p>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const data = await client.users.list({ limit: 100 });

  return {
    props: {
      data,
    },
  };
};
