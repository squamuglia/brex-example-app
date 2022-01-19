import { useRouter } from "next/router";
import api from "@/lib/api";
import * as React from "react";
import Head from "next/head";
import cx from "classnames";
import type { GetServerSidePropsContext, NextPage } from "next";
import type { PaginatedResponse, Card } from "@/lib/sharedTypes";

const Cards: NextPage<{ data: PaginatedResponse<Card> }> = ({ data }) => {
  const [cards, setCards] = React.useState<Card[]>(data.items);
  const [cursor, setCursor] = React.useState<string | undefined>(
    data.next_cursor
  );

  const [selectCards, toggleSelectCards] = React.useState<boolean>(false);
  const [selectedCards, setSelectedCards] = React.useState<
    (string | undefined)[]
  >([]);

  const [isLockingCards, setIsLockingCards] = React.useState<boolean>(false);
  const router = useRouter();

  const handleEditButtonClick = React.useCallback(
    (card_id: string) => () => {
      router.push(`/cards/${card_id}`);
    },
    []
  );

  const handleLockCards = React.useCallback(async () => {
    try {
      if (selectCards && selectedCards.length) {
        setIsLockingCards(true);
        await fetch("/api/cards/lock-cards", {
          method: "POST",
          body: JSON.stringify(selectedCards),
        });

        const res_raw = await fetch(`/api/cards`);
        const res = await res_raw.json();

        if (res.items) {
          setCards(res.items);
          setCursor(res.cursor);
          setSelectedCards([]);
          toggleSelectCards(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsLockingCards(false);
  }, [selectCards, selectedCards, setSelectedCards]);

  const handleSelectCard = React.useCallback(
    (card_id: string) => () => {
      if (selectCards) {
        setSelectedCards((c) =>
          c.includes(card_id)
            ? c.filter((id) => id !== card_id)
            : [...c, card_id]
        );
      }
    },
    [selectCards, setSelectedCards]
  );

  const handleSelectAllCards = React.useCallback(() => {
    setSelectedCards((c) => (c.length > 0 ? [] : cards.map((card) => card.id)));
  }, [cards]);

  const handleLoadMore = React.useCallback(async () => {
    const res_raw = await fetch(`/api/cards?cursor=${cursor}`);
    const res = await res_raw.json();

    if (res.items) {
      setCards((c) => [...c, ...res.items]);
      setCursor(res.cursor);
    }
  }, [cursor]);

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

      <button
        className={cx(
          "border-1 text-xl px-4 py-2 leading-4 rounded mb-4 mr-4",
          {
            "bg-black text-white": selectCards,
          }
        )}
        onClick={() => {
          toggleSelectCards((v) => !v);
          setSelectedCards([]);
        }}
      >
        Select Cards
      </button>

      {selectCards ? (
        <button
          className={cx(
            "border-1 text-xl px-4 py-2 leading-4 rounded mb-4 mr-4",
            {
              "bg-black text-white": selectedCards.length === cards.length,
            }
          )}
          onClick={handleSelectAllCards}
        >
          Select All Cards
        </button>
      ) : null}

      {selectCards ? (
        <button
          className={cx(
            "border-1 text-xl px-4 py-2 leading-4 rounded mb-4 mr-4",
            {
              "text-gray-300": !selectedCards.length,
              "bg-black text-white": selectedCards.length === cards.length,
            }
          )}
          onClick={handleLockCards}
          disabled={isLockingCards}
        >
          {isLockingCards ? "Loading" : "Lock Selected Cards"}
        </button>
      ) : null}

      <ul className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <li
            className={cx(
              "border-1 rounded-md p-4 overflow-hidden relative min-h-36",
              {
                "bg-green-100": card.status === "ACTIVE",
                "bg-red-300": card.status === "TERMINATED",
                "bg-gray-200": card.status === "SHIPPED",
                "bg-yellow-200": card.status === "LOCKED",
                "bg-blue-200": selectedCards.includes(card.id),
                "cursor-pointer": selectCards,
              }
            )}
            key={card.id}
            onClick={handleSelectCard(card.id)}
          >
            {card.status === "ACTIVE" && !selectCards ? (
              <button
                onClick={handleEditButtonClick(card.id)}
                className="border-1 p-1 leading-4 absolute right-2 top-2 rounded text-white bg-black"
              >
                Edit
              </button>
            ) : null}
            <p>**** **** **** {card.last_four}</p>
            <p>{card.status}</p>
            <p>{card.card_type}</p>
            <p>{card.owner.user_id}</p>
          </li>
        ))}
      </ul>

      {cursor ? (
        <div className="flex justify-center m-4">
          <button
            className="border-1 text-xl px-4 py-2 leading-4 rounded"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Cards;

export const getServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const query = new URLSearchParams({ limit: "100" }).toString();

  const data = await api.get(`/v2/cards?${query}`);

  return {
    props: {
      data,
    },
  };
};
