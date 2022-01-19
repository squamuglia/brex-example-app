import api from "@/lib/api";
import { useRouter } from "next/router";
import * as React from "react";
import Head from "next/head";
import cx from "classnames";
import type { GetServerSidePropsContext, NextPage } from "next";
import type { PaginatedResponse, Departments } from "@/lib/sharedTypes";

const DepartmentsPage: NextPage<{ data: PaginatedResponse<Departments> }> = ({
  data,
}) => {
  const router = useRouter();

  const handleEditButtonClick = React.useCallback(
    (id: string) => () => router.push(`/departments/${id}`),
    []
  );

  if (!data) {
    return <p>loading</p>;
  }

  return (
    <div>
      <Head>
        <title>Brex Power User Starter App | Cards</title>
        <meta name="description" content="Make bulk changes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul className="grid grid-cols-4 gap-2">
        {data.items.map((department) => (
          <li
            className="border-1 rounded-md p-4 overflow-hidden relative min-h-36"
            key={department.id}
          >
            {/* <button
                onClick={handleEditButtonClick(department.id)}
                className="border-1 p-1 leading-4 absolute right-2 top-2 rounded text-white bg-black"
              >
                Edit
              </button> */}
            <p>{department.name}</p>
            <p>{department.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentsPage;

export const getServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const data = await api.get("/v2/departments");

  return {
    props: {
      data,
    },
  };
};
