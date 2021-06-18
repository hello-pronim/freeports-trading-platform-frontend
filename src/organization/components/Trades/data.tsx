const manualTrades = [
  {
    id: 1,
    date: "24.05.2021",
    investorId: "100000",
    investors: "Investor ID",
    status: "New",
    send: "",
    claimedValue: "BTC 0.20",
  },
  {
    id: 2,
    date: "24.05.2021",
    investorId: "100001",
    investors: "Investor ID",
    status: "New",
    send: "CHF 10'000",
    claimedValue: "",
  },
  {
    id: 3,
    date: "24.05.2021",
    investorId: "100002",
    investors: "Investor ID",
    status: "Ongoing",
    send: "CHF 10'000",
    claimedValue: "",
  },
  {
    id: 4,
    date: "24.05.2021",
    investorId: "100003",
    investors: "Investor ID",
    status: "Ongoing",
    send: "",
    claimedValue: "BTC 0.20",
  },
  {
    id: 5,
    date: "24.05.2021",
    investorId: "100004",
    investors: "Investor ID",
    status: "Ongoing",
    send: "",
    claimedValue: "BTC 0.20",
  },
];

const tradeHistory = [
  {
    id: 1,
    date: "24.05.2021",
    investorId: "100005",
    investors: "Investor ID",
    order: "At market",
    status: "Accepted",
    send: "CHF 10'000",
    receive: "BTC 0.20",
    broker: "Broker name",
    commission: "CHF 347.60",
  },
  {
    id: 2,
    date: "24.05.2021",
    investorId: "100006",
    investors: "Investor ID",
    order: "Limits",
    status: "Accepted",
    send: "CHF 10'000",
    receive: "BTC 0.20",
    broker: "Broker name",
    commission: "CHF 347.60",
  },
  {
    id: 3,
    date: "24.05.2021",
    investorId: "100007",
    investors: "Investor ID",
    order: "At market",
    status: "Accepted",
    send: "CHF 10'000",
    receive: "BTC 0.20",
    broker: "Broker name",
    commission: "CHF 347.60",
  },
  {
    id: 4,
    date: "24.05.2021",
    investorId: "100008",
    investors: "Investor ID",
    order: "Limits",
    status: "Accepted",
    send: "CHF 10'000",
    receive: "BTC 0.20",
    broker: "Broker name",
    commission: "CHF 347.60",
  },
  {
    id: 5,
    date: "24.05.2021",
    investorId: "100009",
    investors: "Investor ID",
    order: "At market",
    status: "Accepted",
    send: "CHF 10'000",
    receive: "BTC 0.20",
    broker: "Broker name",
    commission: "CHF 347.60",
  },
];

export default {
  manualTrades,
  tradeHistory,
};
