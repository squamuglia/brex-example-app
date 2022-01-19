import type { NextApiRequest, NextApiResponse } from "next";
import { guard, array, string } from "decoders";
import { CardTerminationReason } from "@/lib/sharedTypes";
import api from "@/lib/api";

const POST_BODY_DECODER = array(string);

export default async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const json = await JSON.parse(req.body);
    const safeBody = guard(POST_BODY_DECODER)(json);
    console.log(safeBody);
    const responses = await Promise.all(
      safeBody.map(async (id) =>
        api.post(`/v2/cards/${id}/lock`, {
          description: "bulk card lock",
          reason: CardTerminationReason.DO_NOT_NEED_VIRTUAL_CARD,
        })
      )
    );

    console.log(responses);

    res.status(200).send(responses);
  }
}
