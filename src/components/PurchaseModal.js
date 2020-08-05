import React, { useState, useContext } from "react";
import { BookingContext } from "./BookingContext";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export const PurchaseModal = () => {
  const [creditCard, setCreditCard] = useState("");
  const [expiration, setExpiration] = useState("");

  const classes = useStyles();
  const {
    bookingState: { selectedSeatId, price, status, error },
    actions: {
      cancelBookingProcess,
      purchaseTicketRequest,
      purchaseTicketFailure,
      purchaseTicketSuccess,
    },
  } = useContext(BookingContext);
  const handleClick = () => cancelBookingProcess();
  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      cancelBookingProcess();
    }
  };

  const handlePurchase = () => {
    purchaseTicketRequest();
    const ticketData = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seatId: `${selectedSeatId[0]}-${selectedSeatId[1]}`,
        creditCard,
        expiration,
      }),
    };
    fetch("./api/book-seat", ticketData)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) {
          purchaseTicketFailure();
        } else {
          purchaseTicketSuccess();
        }
      });
  };
  return (
    <Dialog
      open={selectedSeatId !== null}
      aria-label="purchase ticket"
      onKeyDown={handleEscape}
    >
      {status === "awaiting-response" && <CircularProgress />}
      <DialogTitle>Purchase Ticket</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please confirm the following order:{" "}
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Row</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Seat</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Price</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>{selectedSeatId[0]}</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>{selectedSeatId[1]}</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>${price}</Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogContent>
        <DialogContentText>Enter payment details</DialogContentText>
        <TextField
          autoFocus
          id="credit card"
          label="Credit Card"
          type="number"
          variant="filled"
          value={creditCard}
          onChange={(e) => setCreditCard(e.target.value)}
        />
        <TextField
          id="expirate"
          label="Exp"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
        />
        {error && <DialogContentText>{error}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick}>Cancel</Button>
        <Button onClick={handlePurchase}>Purchase</Button>
      </DialogActions>
    </Dialog>
  );
};

export const PurchaseSuccessModal = () => {
  const {
    bookingState,
    actions: { cancelBookingProcess },
  } = useContext(BookingContext);
  const handleClick = () => cancelBookingProcess();
  return (
    <Dialog
      open={bookingState.status === "purchased"}
      aria-label="ticket purchased"
    >
      <DialogContent>Ticket purchased successfully. Enjoy!</DialogContent>
      <DialogActions>
        <Button onClick={handleClick}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
