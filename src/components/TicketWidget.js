import React, { useContext } from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getRowName, getSeatNum } from "../helpers";
import { range } from "../utils";
import { SeatContext } from "./SeatContext";
import { BookingContext } from "./BookingContext";
import SeatImg from "../assets/seat-available.svg";
import Tippy from "@tippyjs/react";
import { PurchaseModal } from "./PurchaseModal";

const TicketWidget = () => {
  const { state } = useContext(SeatContext);
  const {
    bookingState,
    actions: { beginBookingProcess },
  } = useContext(BookingContext);
  // TODO: use values from Context
  const { numOfRows, seatsPerRow, hasLoaded, seats } = state;
  // TODO: implement the loading spinner <CircularProgress />
  // with the hasLoaded flag
  return (
    <Wrapper>
      {hasLoaded || <CircularProgress />}
      {bookingState.selectedSeatId && <PurchaseModal />}
      {range(numOfRows).map((rowIndex) => {
        const rowName = getRowName(rowIndex);

        return (
          <Row key={rowIndex}>
            <RowLabel>Row {rowName}</RowLabel>
            {range(seatsPerRow).map((seatIndex) => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;

              return (
                <SeatWrapper key={seatId}>
                  <Seat
                    rowName={rowName}
                    seatIndex={seatIndex + 1}
                    price={seats[seatId].price}
                    availability={!seats[seatId].isBooked}
                    beginBookingProcess={beginBookingProcess}
                    selectedSeatId={bookingState.selectedSeatId}
                  />
                </SeatWrapper>
              );
            })}
          </Row>
        );
      })}
    </Wrapper>
  );
};

const Seat = ({
  rowName,
  seatIndex,
  price,
  availability,
  beginBookingProcess,
  selectedSeatId,
}) => {
  return (
    <Tippy
      content={
        <Tooltip>
          Row {rowName}, Seat {seatIndex} - ${price}
        </Tooltip>
      }
    >
      <SeatBtn
        disabled={!availability}
        availability={availability}
        onClick={() => beginBookingProcess({ rowName, seatIndex, price })}
      >
        <img
          src={SeatImg}
          alt="available seat"
          style={!availability ? { filter: "grayscale(100%)" } : {}}
        />
      </SeatBtn>
    </Tippy>
  );
};
const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
  background: #eee;
  border-radius: 3px;
  padding: 8px;
`;

const Row = styled.div`
  /* padding: 1px; */
  display: flex;
  position: relative;

  &:not(:last-of-type) {
    border-bottom: 1px solid #ddd;
  }
`;

const RowLabel = styled.div`
  font-weight: bold;
  position: absolute;
  left: -80px;
  top: 15px;
`;

const SeatWrapper = styled.div`
  padding: 5px;

  img {
    width: 36px;
    height: 36px;
  }
`;

const Tooltip = styled.span`
  background-color: black;
  opacity: 0.5;
`;

const SeatBtn = styled.button`
  border: none;
  cursor: pointer;

  &:hover,
  &:focus {
    outline: none;
    background-color: ${({ availability }) =>
      availability && "rgba(200, 200, 200, 0.4)"};
  }
`;

export default TicketWidget;
