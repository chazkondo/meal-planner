import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
        { backgroundColor: "pink", title: "Curry Stew (Example)", id: "1" },
        {
          title: "Beef Broccoli (Example)",
          id: "2",
          backgroundColor: "red",
          borderColor: "purple",
        },
        { title: "Cereal (Example)", id: "3" },
        { title: "Pancakes (Example)", id: "4" },
        { title: "Waffles (Example)", id: "5" },
      ],
    };
  }

  /**
   * adding dragable properties to external events through javascript
   */
  componentDidMount() {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        let backgroundColor = eventEl.getAttribute("backgroundColor");
        let borderColor = eventEl.getAttribute("borderColor");
        return {
          title: title,
          id: id,
          backgroundColor: backgroundColor,
          borderColor: "rgba(0,0,0,0)",
        };
      },
    });
  }

  /**
   * when we click on event we are displaying event details
   */
  eventClick = (eventClick) => {
    Alert.fire({
      title: eventClick.event.title,
      html:
        `<div class="table-responsive">
      <table class="table">
      <tbody>
      <tr >
      <td>Title</td>
      <td><strong>` +
        eventClick.event.title +
        `</strong></td>
      </tr>
      <tr >
      <td>Start Time</td>
      <td><strong>
      ` +
        eventClick.event.start +
        `
      </strong></td>
      </tr>
      </tbody>
      </table>
      </div>`,

      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove Event",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        eventClick.event.remove(); // It will remove event from the calendar
        Alert.fire("Deleted!", "Your Event has been deleted.", "success");
      }
    });
  };

  render() {
    return (
      <div className="animated fadeIn p-4 demo-app">
        <Row>
          <Col lg={3} sm={3} md={3}>
            <div
              id="external-events"
              style={{
                padding: "10px",
                width: "80%",
                height: "auto",
                maxHeight: "-webkit-fill-available",
              }}
            >
              <p align="center">
                <strong>Meals</strong>
              </p>
              {this.state.events.map((event) => (
                <div
                  className="fc-event"
                  style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "100%",
                  }}
                  title={event.title}
                  data={event.id}
                  backgroundColor={event.backgroundColor}
                  borderColor={event.borderColor}
                  key={event.id}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </Col>
          <Col lg={9} sm={9} md={9}>
            <div className="demo-app-calendar" id="mycalendartest">
              <FullCalendar
                defaultView="dayGridMonth"
                header={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                rerenderDelay={10}
                eventDurationEditable={true}
                editable={true}
                droppable={true}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                ref={this.calendarComponentRef}
                weekends={this.state.calendarWeekends}
                events={this.props.calendarEvents}
                eventDrop={this.drop}
                // drop={this.drop}
                eventReceive={(element) => {
                  console.log(element, "!?");
                }}
                eventClick={this.eventClick}
                // selectable={true}
              />
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <button>Grocery List</button>
        </div>
      </div>
    );
  }
}
