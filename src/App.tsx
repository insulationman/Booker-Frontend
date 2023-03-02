import Calendar from "react-calendar";
import { ViewCallback } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BookerService, Booking, OpenAPI } from "./generated";
import { useEffect, useState } from "react";
import DateIsSame from "./Utils/DateIsSame";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { setTime } from "./Utils/SetTime";

// OpenAPI.BASE = "https://bookerino.azurewebsites.net";
OpenAPI.BASE = "http://localhost:5280";

function App() {
  const [events, setEvents] = useState<Booking[]>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
    reset,
  } = useForm<Booking>();

  useEffect(() => {
    var month = activeStartDate.getMonth() + 1;
    var year = activeStartDate.getFullYear();
    handleUpdateEvents({ year, month });
  }, [activeStartDate]);

  const viewCallback: ViewCallback = (props) => {
    setActiveStartDate(props.activeStartDate);
  };

  const handleDeleteBooking = (booking: Booking) => {
    const month = new Date(booking.start).getMonth() + 1;
    const year = new Date(booking.start).getFullYear();
    booking.rowKey &&
      BookerService.deleteBookings(year, month, booking.rowKey).then(() => {
        handleUpdateEvents({ year, month });
      });
  };

  const handleUpdateEvents = ({
    year,
    month,
  }: {
    year: number;
    month: number;
  }) => {
    BookerService.getBookings(year, month).then((bookings) => {
      setEvents(bookings);
    });
  };

  const handleUpsertBooking = (booking: Booking) => {
    BookerService.postBookings(booking).then((booking) => {
      var date = new Date(booking.start);
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      handleUpdateEvents({ year, month });
      reset();
    });
  };

  const updateTime = (key: keyof Booking, time: string) => {
    const date = new Date(selectedDate);
    var newDate = setTime(date, time);
    setValue(key, newDate.toISOString());
  };

  return (
    <Container className="mt-3">
      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center">
          <Calendar
            onActiveStartDateChange={viewCallback}
            onClickDay={(value: Date, event: React.SyntheticEvent) => {
              setSelectedDate(value);
            }}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {selectedDate && (
            <h3 className="text-center">{selectedDate.toDateString()}</h3>
          )}
          <ListGroup>
            {events?.filter(
              (e) => e.start && DateIsSame(new Date(e.start), selectedDate)
            ).length === 0 ? (
              <ListGroup.Item className="text-center" variant="success">
                No bookings
              </ListGroup.Item>
            ) : (
              events
                ?.filter(
                  (e) => e.start && DateIsSame(new Date(e.start), selectedDate)
                )
                .map((e) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-center"
                    variant="primary"
                  >
                    <div>
                      <h4>{e.name}</h4>
                      <p className="m-0">
                        {moment(e.start).format("hh:mm")} -
                        {moment(e.end).format("hh:mm")}
                      </p>
                      <small>{e.comment}</small>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteBooking(e)}
                    >
                      Ta bort
                    </Button>
                  </ListGroup.Item>
                ))
            )}
          </ListGroup>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {selectedDate && (
            <Form onSubmit={handleSubmit(handleUpsertBooking)}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  {...register("name", { required: true })}
                />
                {errors.name && <span>This field is required</span>}
              </Form.Group>
              <Form.Group controlId="start">
                <Form.Label>Start</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter start"
                  onChange={(e) => updateTime("start", e.target.value)}
                />
                {errors.start && <span>This field is required</span>}
              </Form.Group>
              <Form.Group controlId="end">
                <Form.Label>End</Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Enter end"
                  onChange={(e) => updateTime("end", e.target.value)}
                />
                {errors.end && <span>This field is required</span>}
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter comment"
                  {...register("comment")}
                />
                {errors.comment && <span>This field is required</span>}
              </Form.Group>
              <button type="submit">Submit</button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
