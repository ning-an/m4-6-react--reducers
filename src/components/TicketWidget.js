import React, { useContext } from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getRowName, getSeatNum } from "../helpers";
import { range } from "../utils";
import { SeatContext } from "./SeatContext";
import SeatImg from "../assets/seat-available.svg";
import Tippy from "@tippyjs/react";

const TicketWidget = () => {
  const { state } = useContext(SeatContext);
  // TODO: use values from Context
  const { numOfRows, seatsPerRow, hasLoaded, seats } = state;
  console.log(seats);

  // TODO: implement the loading spinner <CircularProgress />
  // with the hasLoaded flag
  return (
    <Wrapper>
      {hasLoaded || <CircularProgress />}
      {range(numOfRows).map((rowIndex) => {
        const rowName = getRowName(rowIndex);

        return (
          <Row key={rowIndex}>
            <RowLabel>Row {rowName}</RowLabel>
            {range(seatsPerRow).map((seatIndex) => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;
              const seatOccupied = seats[seatId].isBooked;

              return (
                <SeatWrapper key={seatId}>
                  <Tippy
                    content={
                      <Tooltip>
                        Row {rowName}, Seat {getSeatNum(seatIndex)} - $
                        {seats[seatId].price}
                      </Tooltip>
                    }
                  >
                    <img
                      src={SeatImg}
                      alt="available seat"
                      style={seatOccupied ? { filter: "grayscale(100%)" } : {}}
                    />
                  </Tippy>
                </SeatWrapper>
              );
            })}
          </Row>
        );
      })}
    </Wrapper>
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
  cursor: pointer;
`;

const Tooltip = styled.span`
  background-color: black;
  opacity: 0.5;
`;

export default TicketWidget;
