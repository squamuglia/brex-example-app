import api from "@/lib/api";
import * as React from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, NextPage } from "next";
import type { CardPan, Card } from "@/lib/sharedTypes";

const Cards: NextPage<{ data: Card; cardPan: CardPan }> = ({
  data,
  cardPan,
}) => {
  const asteriskNum = `**** **** **** ${data.last_four}`;
  const [displayNumber, setDisplayNumber] = React.useState<string>(asteriskNum);

  const handleCardNumberHover = React.useCallback(() => {
    setDisplayNumber((d) => (d.includes("*") ? cardPan.number : asteriskNum));
  }, [cardPan, setDisplayNumber]);

  return (
    <div>
      <Head>
        <title>Brex Power User Starter App | Cards</title>
        <meta name="description" content="Make bulk changes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="border-1 rounded-md p-2 overflow-hidden relative max-w-sm">
        <p
          onMouseEnter={handleCardNumberHover}
          onMouseLeave={handleCardNumberHover}
          className="cursor-pointer"
        >
          {displayNumber}
        </p>
        <p>
          {cardPan.expiration_date.month}/{cardPan.expiration_date.year}{" "}
          {cardPan.cvv}
        </p>
        <p>{data.status}</p>
        <p>{data.card_type}</p>
      </div>
    </div>
  );
};

export default Cards;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cardId = ctx?.params?.cardId;
  const data = await api.get(`/v2/cards/${cardId}`);
  const cardPan = await api.get(`/v2/cards/${cardId}/pan`);

  return {
    props: {
      data,
      cardPan,
    },
  };
};
