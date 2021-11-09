// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  const getTickerDescription = async (ticker) => {
    const response = await fetch(`https://finance.yahoo.com/quote/${ticker}/`);
    const html = await response.text();
    const match = html.match(/"longBusinessSummary":"(.+?)\.",/);
    return (
      (match && match[1]) ||
      `⚠️  ERROR: Company description for ${ticker} not found. Is the stock symbol accurate?`
    );
  };

  const fetchCompanyDescriptions = async () => {
    if (!req.query.tickers) return {};
    const tickers = req.query.tickers.split(",");

    const result = await Promise.all(
      tickers.map(async (ticker) => {
        const description = await getTickerDescription(ticker);
        return { ticker, description };
      })
    );

    return result;
  };

  res.json(await fetchCompanyDescriptions());
}
