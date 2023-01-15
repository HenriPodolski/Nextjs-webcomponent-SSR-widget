// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  addition: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { query } = req;

  const additions = [
    'containing data with Next.js API route',
    'retrieving data from Next.js API route',
    'this data from Next.js API route is SSR\'rd',
  ];
  const parsedIndex = parseInt((query as {index: string}).index, 10);
  const index = isNaN(parsedIndex) ? 0 : parsedIndex;

  res.status(200).json({ addition: additions[index] })
}
