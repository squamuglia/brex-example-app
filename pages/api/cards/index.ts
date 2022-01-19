import type { NextApiRequest, NextApiResponse } from "next";
import { guard, object, optional, string, number } from "decoders";
// import { Money, CardType, LimitType, SpendDuration } from "@/lib/sharedTypes";

type Data = { cursor: string };

// type PostRequest = {
//   owner: {
//     type: "USER";
//     user_id: string;
//   };
//   card_name: string;
//   card_type: CardType;
//   limit_type: LimitType;
//   spend_controls: {
//     spend_limit?: Money;
//     spend_duration: SpendDuration;
//     reason: string;
//     lock_after_date: string; // "2019-08-24"
//   };
//   mailing_address: {
//     line1: string;
//     line2: string;
//     city: string;
//     state: string;
//     country: string;
//     postal_code: string;
//     phone_number: string;
//   };
// };

const POST_BODY_DECODER = object({
  owner: object({
    type: string,
    user_id: string,
  }),
  card_name: string,
  card_type: string,
  limit_type: string,
  spend_controls: optional(
    object({
      spend_limit: object({
        amount: number,
        currency: string,
      }),
      spend_duration: string,
      reason: optional(string),
      lock_after_date: optional(string), // "2019-08-24"
    })
  ),
  mailing_address: optional(
    object({
      line1: string,
      line2: string,
      city: string,
      state: string,
      country: string,
      postal_code: string,
      phone_number: string,
    })
  ),
});

const PARAMS_DECODER = object({ cursor: optional(string) });

const limit = "100";

export default async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const safeParams = guard(PARAMS_DECODER)(req.query);

    const query = new URLSearchParams(
      safeParams.cursor ? { limit, cursor: safeParams.cursor } : { limit }
    ).toString();

    const resp_raw = await fetch(
      `https://platform.staging.brexapps.com/v2/cards?${query}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.BREX_API_KEY}` },
      }
    );

    const data = await resp_raw.json();

    res.status(200).send(data);
  } else if (req.method === "POST") {
    const safeBody = guard(POST_BODY_DECODER)(req.body);

    const resp_raw = await fetch(
      "https://platform.staging.brexapps.com/v2/cards",
      {
        method: "POST",
        body: JSON.stringify(safeBody),
        headers: { Authorization: `Bearer ${process.env.BREX_API_KEY}` },
      }
    );

    const data = await resp_raw.json();

    res.status(200).send(data);
  }
}
