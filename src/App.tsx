import Calendar from "react-calendar";
import { ViewCallback } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BookerService, Booking, OpenAPI } from "./generated";
import { useEffect, useState } from "react";
import DateIsSame from "./Utils/DateIsSame";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { setTime } from "./Utils/SetTime";
import imageurl from "./assets/horses.png";

OpenAPI.BASE = "https://bookerino.azurewebsites.net";
// OpenAPI.BASE = "http://localhost:5280";

function App() {
  const [events, setEvents] = useState<Booking[]>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);

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
      setShow(true);
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
                Inga bokningar
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
            <Card>
              <Card.Header>
                <h5 className="text-center mb-0">Boka</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(handleUpsertBooking)}>
                  <Form.Group controlId="name">
                    <Form.Control
                      type="text"
                      placeholder="Ditt Namn"
                      {...register("name", { required: true })}
                    />
                    {errors.name && <span>This field is required</span>}
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group controlId="start" className="mt-3">
                        <Form.Control
                          type="time"
                          placeholder="Enter start"
                          onChange={(e) => updateTime("start", e.target.value)}
                          required
                        />
                        {errors.start && <span>This field is required</span>}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="end" className="mt-3">
                        <Form.Control
                          type="time"
                          placeholder="Enter end"
                          onChange={(e) => updateTime("end", e.target.value)}
                          required
                        />
                        {errors.end && <span>This field is required</span>}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="description">
                    <Form.Control
                      type="text"
                      className="mt-3"
                      placeholder="Kommentar"
                      {...register("comment")}
                    />
                    {errors.comment && <span>This field is required</span>}
                  </Form.Group>
                  <Button className="mt-3 w-100" type="submit">
                    Spara
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Modal show={show} onExit={() => setShow(false)}>
        <Modal.Header closeButton onClick={() => setShow(false)}>
          <Modal.Title>GRATTIS!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageurl} alt="horses" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Stäng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
