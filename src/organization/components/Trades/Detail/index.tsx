/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef } from "react";
import Lockr from "lockr";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Tabs,
  Tab,
  Theme,
  Typography,
  TextField,
  useTheme,
} from "@material-ui/core";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import grey from "@material-ui/core/colors/grey";
import purple from "@material-ui/core/colors/purple";
import { BigNumber } from "bignumber.js";

import { DateTime } from "luxon";
import { green } from "@material-ui/core/colors";
import brokers from "./data";
import { useTradeDetailSlice } from "./slice";
import {
  selectTradeRequestDetail,
  selectIsDetailLoading,
  selectRfqsLoading,
  selectRfqs,
  selectBestRfq,
  selectOrderLoading,
  selectRemainingQuantity,
  selectBaseCurrency,
  selectTradeAmount,
  selectPriceEvents,
} from "./slice/selectors";
import Loader from "../../../../components/Loader";
import { RfqResponse } from "../../../../types/RfqResponse";
import AccurateNumber from "../../../../components/AccurateNumber";
import { snackbarActions } from "../../../../components/Snackbar/slice";
import AmountInput from "../AmountInput";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      color: theme.palette.primary.main,
      fontWeight: "bold",
      marginLeft: theme.spacing(2),
    },
    greyCard: {
      backgroundColor: theme.palette.secondary.main,
    },
    primaryCard: {
      backgroundColor: purple[400],
    },
    dividerColor: {
      backgroundColor: grey[200],
    },
    tabPanel: {
      width: "100%",
      "& .MuiBox-root": {
        paddingLeft: "0px",
        paddingRight: "0px",
      },
    },
    errorMessage: {
      marginTop: theme.spacing(8),
    },
    currencyBtnGroup: {
      width: 96,
    },
    tradePanel: {
      color: "#FFF",
    },
    numberInput: {
      border: `2px solid ${grey[300]}`,
      "& input": {
        border: 0,
        color: "currentColor",
        "&:focus": { outline: "none!important" },
        "font-size": "3.75rem",
        "font-family": '"Roboto", "Helvetica", "Arial", sans-serif',
        "font-weight": 300,
        "line-height": 1.2,
        "letter-spacing": "-0.00833em",
        backgroundColor: "transparent",
        width: "100%",
      },
      "& input::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "& input::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },

      /* Firefox */
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
    },
    progressButtonWrapper: {
      position: "relative",
    },
    progressButton: {
      color: theme.palette.primary.main,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    bestBroker: {
      backgroundColor: theme.palette.secondary.main,
    },
    bid: {
      color: green[500],
    },
  })
);

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TradeDetail = (): React.ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { organizationId } = Lockr.get("USER_DATA");
  const { deskId, investorId, tradeId }: any = useParams();
  const tradeRequest = useSelector(selectTradeRequestDetail);
  const { actions: tradeDetailActions } = useTradeDetailSlice();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tradeRequestLoading = useSelector(selectIsDetailLoading);
  const rfqsLoading = useSelector(selectRfqsLoading);
  const orderLoading = useSelector(selectOrderLoading);
  const rfqs = useSelector(selectRfqs);
  const bestRfq = useSelector(selectBestRfq);
  // const rfqs = brokers;
  // const bestRfq = brokers[0];
  const remainingQuantity = useSelector(selectRemainingQuantity);
  const baseCurrency = useSelector(selectBaseCurrency);
  // const tradeAmount = useSelector(selectTradeAmount);

  const priceEvents = useSelector(selectPriceEvents);
  const theme = useTheme();

  useEffect(() => {
    let mounted = false;
    const init = () => {
      dispatch(
        tradeDetailActions.getTradeRequestDetail({
          organizationId,
          deskId,
          investorId,
          tradeId,
        })
      );
    };
    init();

    return () => {
      mounted = true;
    };
  }, []);

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  // const handleAmountChange = (event: any) => {
  //   console.log("input change ", event.target.value);
  //   if (event.target.value !== tradeAmount) {
  //     dispatch(tradeDetailActions.setTradeAmount(event.target.value));
  //   }
  //   // dispatch(
  //   //   tradeDetailActions.getRfqs({
  //   //     organizationId,
  //   //     deskId,
  //   //     investorId,
  //   //     tradeId,
  //   //   })
  //   // );

  //   console.log("input change handeled");
  // };

  const handleOnOrder = (rfq: RfqResponse) => {
    dispatch(
      tradeDetailActions.order({
        organizationId,
        deskId,
        investorId,
        tradeId,
        rfqId: rfq.id,
        quantity: rfq.quantity,
      })
    );
  };

  return (
    <div className="main-wrapper">
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4}>
              <Grid>
                <Typography>Current best broker value</Typography>
              </Grid>
              <Grid container className={classes.bestBroker}>
                <Grid container justify="space-between">
                  <Grid item>Rate</Grid>
                  <Grid item />
                  <Grid item>Cumberland</Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid container justify="center">
                    <Typography align="center">Bid</Typography>
                  </Grid>
                  <Grid container justify="center">
                    <Typography align="center">0.074234 BTC/ETH</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  direction="row"
                >
                  <Button>SELECT </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid container direction="column">
                <Grid item>
                  <Typography>Current tranche Execution</Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="row" justify="space-between">
                    <Grid>Broker</Grid>
                    <Grid>Direction</Grid>
                    <Grid>Order type</Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={5} color={theme.palette.secondary.light}>
                      <Grid container justify="center">
                        <Grid container justify="center">
                          <Typography align="center">bid</Typography>
                        </Grid>
                        <Grid container justify="center">
                          <Typography align="center">0.074234</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      Spread
                    </Grid>
                    <Grid item xs={5}>
                      <Grid container justify="center">
                        <Grid container justify="center">
                          <Typography align="center">bid</Typography>
                        </Grid>
                        <Grid container justify="center">
                          <Typography align="center">0.074234</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            {priceEvents.map((priceEvent) => (
              <Grid item xs={12} md={4}>
                <Grid container direction="column">
                  <Grid item>
                    <Grid container justify="space-between" direction="row">
                      <Grid>Rate</Grid>
                      <Grid>Last RFQ for value </Grid>
                      <Grid>{priceEvent.broker}</Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={5} color={theme.palette.secondary.light}>
                      <Grid container justify="center">
                        <Grid container justify="center">
                          <Typography align="center">bid</Typography>
                        </Grid>
                        <Grid container justify="center">
                          <Typography align="center">
                            {priceEvent.buy}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      Spread
                    </Grid>
                    <Grid item xs={5}>
                      <Grid container justify="center">
                        <Grid container justify="center">
                          <Typography align="center">bid</Typography>
                        </Grid>
                        <Grid container justify="center">
                          <Typography align="center">
                            {priceEvent.sell}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container justify="center">
                      <Button>SELECT </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid>
            <AppBar position="static" color="inherit">
              <Tabs
                value={activeTabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="off"
                indicatorColor="primary"
                aria-label="tabs"
              >
                <Tab
                  icon={<HistoryOutlinedIcon />}
                  aria-label="phone"
                  id="scrollable-prevent-tab-0"
                />
                <Tab
                  icon={<ChatBubbleOutlineOutlinedIcon />}
                  aria-label="favorite"
                  id="scrollable-prevent-tab-1"
                />
                <Tab
                  icon={<InsertDriveFileOutlinedIcon />}
                  aria-label="person"
                  id="scrollable-prevent-tab-2"
                />
                <Tab
                  icon={<Typography variant="subtitle2">Brokers</Typography>}
                  aria-label="help"
                  id="scrollable-prevent-tab-3"
                />
              </Tabs>
            </AppBar>
            <TabPanel
              className={classes.tabPanel}
              value={activeTabIndex}
              index={0}
            >
              <MaterialTable
                columns={[
                  {
                    field: "createdAt",
                    title: "Date",
                    cellStyle: {
                      width: "12%",
                    },
                    render: ({ createdAt }: any) =>
                      createdAt
                        ? DateTime.fromISO(createdAt).toFormat(
                            "y'-'MM'-'dd' 'HH':'mm':'ss"
                          )
                        : "",
                  },
                  {
                    field: "brokerId",
                    title: "Broker",
                    cellStyle: {
                      width: "12%",
                    },
                  },
                  {
                    field: "quantity",
                    title: "Quantity",
                    cellStyle: {
                      width: "12%",
                    },
                  },
                  {
                    field: "price",
                    title: "price",
                    cellStyle: {
                      width: "12%",
                    },
                    render: ({ price, baseCurrency: currency }: any) => (
                      <>
                        <AccurateNumber number={price} />
                        {currency}
                      </>
                    ),
                  },
                ]}
                data={
                  tradeRequest.orders
                    ? tradeRequest.orders.map((order) => ({
                        ...order,
                        baseCurrency,
                      }))
                    : []
                }
                options={{
                  toolbar: false,
                  paging: false,
                }}
              />
            </TabPanel>
            <TabPanel
              className={classes.tabPanel}
              value={activeTabIndex}
              index={1}
            >
              Tab Content 2
            </TabPanel>
            <TabPanel
              className={classes.tabPanel}
              value={activeTabIndex}
              index={2}
            >
              Tab Content 3
            </TabPanel>
            <TabPanel
              className={classes.tabPanel}
              value={activeTabIndex}
              index={3}
            >
              Tab Content 4
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TradeDetail;
