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
  Divider,
  Grid,
  Tabs,
  Tab,
  Theme,
  Typography,
  TextField,
} from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { grey, purple } from "@mui/material/colors";
import { BigNumber } from "bignumber.js";

import { DateTime } from "luxon";
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
} from "./slice/selectors";
import Loader from "../../../../components/Loader";
import { RfqResponse } from "../../../../types/RfqResponse";
import AccurateNumber from "../../../../components/AccurateNumber";
import { snackbarActions } from "../../../../components/Snackbar/slice";
import AmountInput from "../AmountInput";
import PatchedPagination from "../../../../util/patchedPagination";

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
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tradeRequest = useSelector(selectTradeRequestDetail);
  const tradeRequestLoading = useSelector(selectIsDetailLoading);
  const { actions: tradeDetailActions } = useTradeDetailSlice();
  const rfqsLoading = useSelector(selectRfqsLoading);
  const orderLoading = useSelector(selectOrderLoading);
  const rfqs = useSelector(selectRfqs);
  const bestRfq = useSelector(selectBestRfq);
  // const rfqs = brokers;
  // const bestRfq = brokers[0];
  const remainingQuantity = useSelector(selectRemainingQuantity);
  const baseCurrency = useSelector(selectBaseCurrency);
  // const tradeAmount = useSelector(selectTradeAmount);

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
      {tradeRequestLoading && <Loader />}
      {!tradeRequestLoading && (
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5">MANUAL TRADE</Typography>
            </Grid>
            {remainingQuantity === "0" && (
              <Grid item xs={12}>
                <Typography variant="h5">TRADE COMPLETED</Typography>
              </Grid>
            )}
            {remainingQuantity !== "0" && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                      {`(Amount) from (${tradeRequest.accountFrom}) to (${tradeRequest.accountTo}) (Estimated account)`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid container justifyContent="space-between">
                          <Grid item xs={4} md={2}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="space-between"
                              className="h-100"
                            >
                              <Typography variant="subtitle2">
                                Trade value
                              </Typography>
                              {/* <ButtonGroup
                                className={classes.currencyBtnGroup}
                                variant="contained"
                                color="primary"
                                size="small"
                              >
                                <Button>{tradeRequest.currencyTo}</Button>
                                <Button disabled>
                                  {tradeRequest.currencyFrom}
                                </Button>
                              </ButtonGroup> */}
                            </Grid>
                          </Grid>
                          <Grid item xs={8} md={4}>
                            <Box
                              className={classes.numberInput}
                              display="flex"
                              flexDirection="row"
                              alignItems="flex-end"
                              // bgcolor="grey.300"
                              borderRadius="16px"
                              height={100}
                              p={2}
                            >
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                {baseCurrency}
                              </Typography>
                              {/* <Typography variant="h3">30</Typography> */}
                              {/* <input
                                onChange={handleAmountChange}
                                type="number"
                                value={tradeAmount}
                                max={tradeRequest.quantity}
                              /> */}
                              <AmountInput />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Grid
                              container
                              justifyContent="flex-end"
                              spacing={2}
                            >
                              <Grid item>
                                <Divider orientation="vertical" />
                              </Grid>
                              <Grid item>
                                <Box
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="flex-end"
                                  height={100}
                                  p={2}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {baseCurrency}
                                  </Typography>
                                  <Typography variant="h3">
                                    {remainingQuantity}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Box
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="flex-end"
                                  height={100}
                                  p={2}
                                >
                                  <Typography variant="subtitle2">
                                    remaining of
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Box
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="flex-end"
                                  height={100}
                                  p={2}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {baseCurrency}
                                  </Typography>
                                  <Typography variant="h3">
                                    {tradeRequest.quantity}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider className={classes.dividerColor} />
                      <CardActions>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Source account balance
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="subtitle2"
                              style={{ fontWeight: 600 }}
                            >
                              {tradeRequest.currencyFrom} 120&#39;000
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {rfqsLoading && <Loader />}
            {remainingQuantity !== "0" && !rfqsLoading && rfqs.length > 0 && (
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6">BEST BROKER VALUE</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Card>
                          <CardHeader
                            title={
                              <Typography variant="h6" align="right">
                                {bestRfq.brokerId}
                              </Typography>
                            }
                          />
                          <Divider />
                          <CardContent>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <Typography
                                  variant="body2"
                                  style={{
                                    fontWeight: 600,
                                    marginRight: "10px",
                                  }}
                                >
                                  Rate
                                </Typography>
                                <Typography variant="h5">
                                  {`${tradeRequest.currencyTo} `}
                                  <AccurateNumber number={bestRfq.price} />
                                  {`/${tradeRequest.currencyFrom}`}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="flex-end"
                              xs={12}
                            >
                              <Typography
                                variant="body2"
                                style={{
                                  fontWeight: 600,
                                  marginRight: "10px",
                                }}
                              >
                                {tradeRequest.currencyFrom !== baseCurrency
                                  ? tradeRequest.currencyFrom
                                  : tradeRequest.currencyTo}
                              </Typography>
                              <Typography variant="body2">
                                <AccurateNumber
                                  number={new BigNumber(bestRfq.price)
                                    .times(new BigNumber(bestRfq.quantity))
                                    .toString()}
                                />
                              </Typography>
                            </Grid>
                          </CardContent>
                          <Divider className={classes.dividerColor} />
                          <CardActions disableSpacing>
                            <Grid container>
                              <Grid item xs={12}>
                                <div className={classes.progressButtonWrapper}>
                                  <Button
                                    variant="contained"
                                    className="w-100"
                                    color="primary"
                                    onClick={() => handleOnOrder(bestRfq)}
                                    disabled={orderLoading}
                                  >
                                    Click to order!
                                  </Button>
                                  {orderLoading && (
                                    <CircularProgress
                                      size={24}
                                      className={classes.progressButton}
                                    />
                                  )}
                                </div>
                              </Grid>
                            </Grid>
                          </CardActions>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6">ALL BROKERS</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          {rfqs.map((rfq: any) => (
                            <Grid key={rfq.id} item xs={3}>
                              <Card className="w-100">
                                <CardContent>
                                  <Grid container justifyContent="flex-end">
                                    <Grid item>
                                      <Typography variant="body1">
                                        {rfq.brokerId}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    xs={12}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {tradeRequest.currencyFrom !==
                                      baseCurrency
                                        ? tradeRequest.currencyFrom
                                        : tradeRequest.currencyTo}
                                    </Typography>
                                    <Typography variant="h5">
                                      <AccurateNumber
                                        number={new BigNumber(rfq.price)
                                          .times(new BigNumber(rfq.quantity))
                                          .toString()}
                                      />
                                    </Typography>
                                  </Grid>
                                  <Grid container justifyContent="flex-end">
                                    <Grid item>
                                      <Grid container spacing={1}>
                                        <Grid item>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              fontWeight: 600,
                                              marginRight: "10px",
                                            }}
                                          >
                                            Rate
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography variant="body2">
                                            {`${tradeRequest.currencyTo} `}
                                            <AccurateNumber
                                              number={rfq.price}
                                            />
                                            {`/${tradeRequest.currencyFrom}`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                                <Divider className={classes.dividerColor} />
                                <CardActions disableSpacing>
                                  <Grid container>
                                    <Grid item xs={12}>
                                      <div
                                        className={
                                          classes.progressButtonWrapper
                                        }
                                      >
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          className="w-100"
                                          onClick={() => handleOnOrder(rfq)}
                                          disabled={orderLoading}
                                        >
                                          Click to order!
                                        </Button>
                                        {orderLoading && (
                                          <CircularProgress
                                            size={24}
                                            className={classes.progressButton}
                                          />
                                        )}
                                      </div>
                                    </Grid>
                                  </Grid>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <AppBar position="static" color="inherit">
                <Tabs
                  value={activeTabIndex}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons={false}
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
                  components={{ Pagination: PatchedPagination }}
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
        </Container>
      )}{" "}
    </div>
  );
};

export default TradeDetail;
