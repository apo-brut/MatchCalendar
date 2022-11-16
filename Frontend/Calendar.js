import { dateString, getDayIndex, addDays, generateId } from "./helper.js";
import { Event, MODE } from "./Event.js";

var LinkedCalendarChecked = [];
var lstAllCalendarEntriesByUser = {};
var currentUserId = "1" // TODO getuserID
var token = "";
var identifier = ""

/* var lstAllCalendarEntriesByUser = {
    '1': {
        'userName': "Wladislaw Kusnezow"
        , 'events': {
            "2022-11-09": {
                "1": {
                    'color': "blue"
                    , 'date': "2022-11-09"
                    , 'description': "oh boy\n"
                    , 'end': "21:27"
                    , 'id': "zwXPQTUx3PJCPx8h24xC"
                    , 'prevDate': "2022-11-08"
                    , 'start': "03:00"
                    , 'title': "Wladi 2022-11-02"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            },
            "2022-11-10": {
                "2": {
                    'color': "green"
                    , 'date': "2022-11-10"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "16:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xD"
                    , 'prevDate': "2022-11-09"
                    , 'start': "13:00"
                    , 'title': "Wladi 2022-11-09"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                },
                "6": {
                    'color': "green"
                    , 'date': "2022-11-10"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "12:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xL"
                    , 'prevDate': "2022-11-09"
                    , 'start': "11:00"
                    , 'title': "test"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                },
                "8": {
                    'color': "green"
                    , 'date': "2022-11-10"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "19:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xO"
                    , 'prevDate': "2022-11-09"
                    , 'start': "18:00"
                    , 'title': "test"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            },
            "2022-11-11": {
                "7": {
                    'color': "green"
                    , 'date': "2022-11-11"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "16:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xG"
                    , 'prevDate': "2022-11-10"
                    , 'start': "03:00"
                    , 'title': "AAAAAA"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            }
        }
    },
    '2': {
        'userName': "Abdullah Yüksel"
        , 'events': {
            "2022-11-08": {
                "3": {
                    'color': "red"
                    , 'date': "2022-11-08"
                    , 'description': "oh boy\n"
                    , 'end': "21:27"
                    , 'id': "zwXPQTUx3PJCPx8h24xA"
                    , 'prevDate': "2022-11-07"
                    , 'start': "03:00"
                    , 'title': "Genna 2022-11-01"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            },
            "2022-11-09": {
                "5": {
                    'color': "green"
                    , 'date': "2022-11-09"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "16:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xG"
                    , 'prevDate': "2022-11-08"
                    , 'start': "3:00"
                    , 'title': "AAAAAA"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            },
            "2022-11-11": {
                "4": {
                    'color': "orange"
                    , 'date': "2022-11-11"
                    , 'description': "oh boy Jolli\n"
                    , 'end': "20:00"
                    , 'id': "zwXPQTUx3PJCPx8h25xF"
                    , 'prevDate': "2022-11-10"
                    , 'start': "12:00"
                    , 'title': "Genna 2022-11-04"
                    , 'calendar_type': "0"
                    , 'matchID': "0"
                }
            }
        }
    }
}; */

export class Calendar {
    constructor() {
        this.mode = MODE.VIEW;
        this.events = {};
        this.weekOffset = 0;
        this.readyToTrash = false;
        this.slotHeight = 60;
        this.weekStart = null;
        this.weekEnd = null;
        this.eventsLoaded = false;
    }

    loginSuccess = function (newUserId, newToken, newIdentfier) {
        this.currentUserId = newUserId;
        this.token = newToken;
        this.identifier = newIdentfier;

        var tempThis = this;
        $.get("https://h2970110.stratoserver.net:3000/api/" + this.token + "/" + this.identifier + "/calenderevent?userid=" + this.currentUserId, function (response) {
            console.log("Get-Events-Response:")
            console.log(response);

            if (response[tempThis.currentUserId] !== undefined) {
                lstAllCalendarEntriesByUser[currentUserId] = response[tempThis.currentUserId];
            }

            tempThis.token = response.newToken;
            tempThis.setup();
        });
    }

    setup = function () {
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.showWeek();
        this.SetupDatePickerSidebar();
        this.LoadLinkedCalendar();
        this.loadEvents();
        this.setupControls();
    }

    setupControls() {
        $("#nextWeekBtn").click(() => this.changeWeek(1));
        $("#prevWeekBtn").click(() => this.changeWeek(-1));
        $("#addButton").click(() => this.addNewEvent());
        $("#trashButton").click(() => this.trash());
        $("#cancelButton").click(() => this.closeModal());
        $("#cancelButtonEvent").click(() => this.closeModal());
        $("#currentWeek").click(() => this.moveToCurrentDay());
        $(".color").click(this.changeColor);
    }

    changeWeekWithByDatepicker = function (selectedDate) {

        var temp2 = new Date(selectedDate);
        var temp3 = new Date(selectedDate);

        //get last monday
        const previousMonday = temp2;
        previousMonday.setDate(temp2.getDate() - ((temp2.getDay() + 6) % 7));
        previousMonday.setMonth(temp2.getMonth());
        previousMonday.setFullYear(temp2.getFullYear());

        //get next sunday
        const first = temp3.getDate() - temp3.getDay() + 1;
        const last = first + 6;
        const sunday = new Date(temp3.setDate(last));
        sunday.setMonth(temp3.getMonth());


        //this.weekOffset += number;
        this.weekStart = previousMonday;
        this.weekEnd = sunday;
        this.showWeek();
        this.loadEvents();
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.weekStart = addDays(this.weekStart, 7 * number);
        this.weekEnd = addDays(this.weekEnd, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    SetupDatePickerSidebar() {
        var tempThis = this;
        $("#datePickerSidebar").datepicker({
            prevText: "Last",
            nextText: "Next",
            firstDay: 1,
            onSelect: function (dateText, inst) {
                var date = $(this).val();
                console.log("Current Date selected: " + date);
                tempThis.changeWeekWithByDatepicker(new Date(date));
            }
        });
    }

    setupTimes() {
        const header = $("<div></div>").addClass("columnHeader");
        const slots = $("<div></div>").addClass("slots");
        for (let hour = 0; hour < 24; hour++) {
            $("<div></div>")
                .attr("data-hour", hour)
                .addClass("time")
                .text(`${hour}:00 - ${hour + 1}:00`)
                .appendTo(slots);
        }
        $(".dayTime").append(header).append(slots);
    }

    setupDays() {
        const cal = this;
        $(".day").each(function () {
            const dayIndex = parseInt($(this).attr("data-dayIndex"));
            const name = $(this).attr("data-name");
            const header = $("<div></div>").addClass("columnHeader").text(name);
            const slots = $("<div></div>").addClass("slots");
            $("<div></div>").addClass("dayDisplay").appendTo(header);
            for (let hour = 0; hour < 24; hour++) {
                $("<div></div>")
                    .attr("data-hour", hour)
                    .appendTo(slots)
                    .addClass("slot")
                    .click(() => cal.clickSlot(hour, dayIndex))
                    .hover(
                        () => cal.hoverOver(hour),
                        () => cal.hoverOut()
                    );
            }
            $(this).append(header).append(slots);
        });
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.weekStart = addDays(now, -getDayIndex(now));
        this.weekEnd = addDays(this.weekStart, 6);
    }

    showWeek() {
        const options = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        };
        $("#weekStartDisplay").text(
            this.weekStart.toLocaleDateString(undefined, options)
        );
        $("#weekEndDisplay").text(this.weekEnd.toLocaleDateString(undefined, options));

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString(undefined, {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit"
            });
            $(`.day[data-dayIndex=${dayIndex}] .dayDisplay`).text(display);
        }
        if (this.weekOffset == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    moveToCurrentDay() {
        this.calculateCurrentWeek();
        this.showWeek();
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        $(`.day[data-dayIndex=${dayIndex}]`).addClass("currentDay");
    }

    hideCurrentDay() {
        $(".day").removeClass("currentDay");
    }

    hoverOver(hour) {
        $(`.time[data-hour=${hour}]`).addClass("currentTime");
    }

    hoverOut() {
        $(".time").removeClass("currentTime");
    }

    clickSlot(hour, dayIndex) {
        if (this.mode != MODE.VIEW) return;
        this.mode = MODE.CREATE;
        const start = hour.toString().padStart(2, "0") + ":00";
        const end =
            hour < 23
                ? (hour + 1).toString().padStart(2, "0") + ":00"
                : hour.toString().padStart(2, "0") + ":59";

        const date = dateString(addDays(this.weekStart, dayIndex));
        const event = new Event({
            start,
            end,
            date,
            title: "",
            description: "",
            color: "red",
        });
        this.openModal(event);
    }

    changeColor() {
        $(".color").removeClass("active");
        $(this).addClass("active");
    }

    openModal(event) {
        $("#modalTitle").text(
            this.mode == MODE.UPDATE ? "Update your event" : "Create a new event"
        );
        $("#eventTitle").val(event.title);
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventDescription").val(event.description);
        $(".color").removeClass("active");
        $(`.color[data-color=${event.color}]`).addClass("active");
        if (this.mode == MODE.UPDATE) {
            $("#submitButton").val("Update");
            $("#deleteButton")
                .show()
                .off("click")
                .click(() => event.deleteIn(this));
            $("#copyButton")
                .show()
                .off("click")
                .click(() => event.copyIn(this));
        } else if (this.mode == MODE.CREATE) {
            $("#submitButton").val("Create");
            $("#deleteButton, #copyButton").hide();
        }
        $("#eventModal").fadeIn(200);
        $("#eventTitle").focus();
        $("#calendar").addClass("opaque");
        $("#eventModal")
            .off("submit")
            .submit((e) => {
                e.preventDefault();
                this.submitModal(event);
            });
    }

    submitModal(event) {
        if (event.isValidIn(this)) {
            event.updateIn(this);
            this.closeModal();
        }
    }

    closeModal() {
        $("#eventModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        this.mode = MODE.VIEW;
    }

    addNewEvent() {
        if (this.mode != MODE.VIEW) return;
        this.mode = MODE.CREATE;
        const event = new Event({
            start: "12:00",
            end: "13:00",
            date: dateString(this.weekStart),
            title: "",
            description: "",
            color: "red",
        });
        this.openModal(event);
    }

    saveEvents() {
        localStorage.setItem("events", JSON.stringify(this.events));
    }

    loadEvents() {
        $(".event").remove();
        if (!this.eventsLoaded) {
            this.events = {};

            Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
                if (LinkedCalendarChecked.find(x => x.userId === key).isChecked === true) {
                    Object.keys(lstAllCalendarEntriesByUser[key]["events"]).forEach(innerKey => {
                        if (!this.events[innerKey])
                            this.events[innerKey] = {};

                        Object.keys(lstAllCalendarEntriesByUser[key]["events"][innerKey]).forEach(lastKey => {
                            this.events[innerKey][lastKey] = lstAllCalendarEntriesByUser[key]["events"][innerKey][lastKey];
                        });
                    });
                }
            });
            if (this.events) {
                for (const date of Object.keys(this.events)) {
                    for (const id of Object.keys(this.events[date])) {
                        const event = new Event(this.events[date][id]);
                        this.events[date][id] = event;
                    }
                }
            }

            this.eventsLoaded = true;
        }
        if (this.events) {
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const date = dateString(addDays(this.weekStart, dayIndex));
                if (this.events[date]) {
                    for (const event of Object.values(this.events[date])) {
                        event.showIn(this);
                    }
                }
            }
        } else {
            this.events = {};
        }
    }

    trash() {
        if (this.mode != MODE.VIEW) return;
        if (this.readyToTrash) {
            this.readyToTrash = false;
            this.events = {};
            this.saveEvents();
            $(".event").remove();
        } else {
            this.readyToTrash = true;
            window.alert(
                "This will delete all the events in your calendar. " +
                "This cannot be undone. If you are sure, click " +
                "the trash can again in the next minute."
            );
            setTimeout(() => {
                this.readyToTrash = false;
            }, 60 * 1000);
        }
    }

    LoadLinkedCalendar() {
        var html = "<ul id='ulLstLinkedCalendar'><h3>Linked Calendar</h3>"
        var tempThis = this;

        Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
            var isChecked = key === tempThis.currentUserId.toString() ? true : false;
            var userName = lstAllCalendarEntriesByUser[key].userName;

            html = html + '<li>'
                + '<input type="checkbox" name="LinkedCalendar_' + key + '" id="LinkedCalendar_' + key + '" >'
                + '<label for="LinkedCalendar_' + key + '" >' + userName + '</label>'
                + '</li>';

            LinkedCalendarChecked.push({ "userId": key, "key": "LinkedCalendar_" + key, "isChecked": isChecked });
        });

        html = html + "</ul>";

        //create button for generating of Events
        html = html + '<input id="GenerateEventsBtn" class="button generateBtn" type="button" value="Generate" class="button" >';

        //append created html to its div
        $("#lstLinkedCalendar").append(html);

        //set functions
        var tempThis = this;
        //does not work
        Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
            var checkbox = document.getElementById('LinkedCalendar_' + key);
            checkbox.onclick = function () {
                tempThis.CheckboxClicked(checkbox.id);
            }
        });

        var generateBtn = document.getElementById('GenerateEventsBtn');
        generateBtn.onclick = function () {
            tempThis.GenerateEventsForLinkedCalendar();
        }
    }

    CheckboxClicked(elementId) {
        var checkboxValue = $('#' + elementId).is(":checked");

        var tst = LinkedCalendarChecked.filter(x => x.key === elementId);
        tst.isChecked = checkboxValue;
        LinkedCalendarChecked.find(x => x.key === elementId).isChecked = checkboxValue;

        //console.log(LinkedCalendarChecked);
        this.eventsLoaded = false;
        this.loadEvents();
    }

    GenerateEventsForLinkedCalendar = function () {
        var currentEvents = {};
        var currentEventsDates = [];
        var generateEvents = {};

        //get all events from all linked caledar
        Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
            if (!currentEvents[key]) currentEvents[key] = {};

            Object.keys(lstAllCalendarEntriesByUser[key]["events"]).forEach(innerKey => {
                if (!currentEventsDates.find(x => x === innerKey)) currentEventsDates.push(innerKey);

                if (!currentEvents[key][innerKey]) currentEvents[key][innerKey] = {}; 1

                Object.keys(lstAllCalendarEntriesByUser[key]["events"][innerKey]).forEach(lastKey => {
                    currentEvents[key][innerKey][lastKey] = lstAllCalendarEntriesByUser[key]["events"][innerKey][lastKey];
                });
            });
        });

        //get currentweek
        var currentWeekStart = new Date(this.weekStart);
        currentWeekStart.setHours(0, 0, 0, 0);
        var currentWeekEnd = new Date(this.weekEnd);
        currentWeekEnd.setHours(23, 59, 59, 999);

        var tempDate = new Date(currentWeekStart);
        //get days without event and create event from 00:00 - 24:00
        for (let i = 0; i < 7; i++) {
            //tempDate.setDate(currentWeekStart.getDate() + i);
            tempDate = new Date(currentWeekStart);
            tempDate = new Date(tempDate.setDate(tempDate.getDate() + i));

            var year = tempDate.getFullYear();
            var month = (tempDate.getMonth() + 1).toString().length === 1 ? "0" + (parseInt(tempDate.getMonth()) + 1) : parseInt(tempDate.getMonth()) + 1;
            var day = tempDate.getDate().toString().length === 1 ? "0" + tempDate.getDate() : tempDate.getDate();

            if (tempDate >= currentWeekStart && tempDate <= currentWeekEnd) {
                var newId = generateId();
                if (!currentEventsDates.find(x => x === year + '-' + month + '-' + day)) {
                    generateEvents[year + '-' + month + '-' + day] = {}
                    generateEvents[year + '-' + month + '-' + day][newId] = this.CreateEvent("grey", year + '-' + month + '-' + day, "", "24:00", newId, "00:00", "Generated Event");
                } else {
                    var currentEventsForDate = [];

                    // get time between events on day with events
                    //first get events for current date in loop
                    Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
                        Object.keys(lstAllCalendarEntriesByUser[key]["events"]).forEach(date => {

                            if (new Date(date).setHours(0, 0, 0, 0) === tempDate.setHours(0, 0, 0, 0)) {
                                if (Object.keys(lstAllCalendarEntriesByUser[key]["events"][date]).length > 1) {

                                    Object.keys(lstAllCalendarEntriesByUser[key]["events"][date]).forEach(innerEvent => {
                                        var event = lstAllCalendarEntriesByUser[key]["events"][date][innerEvent]
                                        var start = event.start;
                                        var end = event.end;
                                        currentEventsForDate.push({ date, start, end });
                                    });

                                } else {
                                    var event = lstAllCalendarEntriesByUser[key]["events"][date][Object.keys(lstAllCalendarEntriesByUser[key]["events"][date])[0]];
                                    var start = event.start;
                                    var end = event.end;
                                    currentEventsForDate.push({ date, start, end });
                                }
                            }
                        });
                    });

                    var start1 = currentEventsForDate.find(x => x.start === "00:00");
                    var end1 = currentEventsForDate.find(x => x.end === "24:00");
                    //if (currentEventsForDate.find(x=> x.start === "00:00") !== undefined && currentEventsForDate.find(x=> x.end === "24:00") !== undefined ){
                    if (currentEventsForDate.length > 1 && start1 !== undefined && end1 !== undefined) {
                        continue;
                    }

                    if (currentEventsForDate.length > 1) {
                        var prevEvent = {};

                        //sort current Array by starting time
                        //todo sortierung stimmt noch nicht es wird nur nach start sortiert, aber was wenn start gleich aber eins ende später
                        var currentEventsForDate = currentEventsForDate.sort((a, b) => (a.start.localeCompare(b.start) && a.end.localeCompare(b.end))); // hier stimmt die sortiernung noch nicht

                        //TODO überschneidungen
                        var minusForPrevEvent = 1;
                        for (let i = 0; i < currentEventsForDate.length; i++) {
                            var event = currentEventsForDate[i];

                            var start = event.start;
                            var end = event.end;
                            var date = event.date;

                            if (generateEvents[date] === undefined) generateEvents[date] = {}

                            if (i === 0) {
                                generateEvents[date][newId] = this.CreateEvent("grey", date, "", start, newId, "00:00", "Generated Event", 1);
                            } else {
                                newId = generateId();
                                prevEvent = currentEventsForDate[i - minusForPrevEvent];

                                if (event.date === "2022-11-9") console.log("")

                                //second is timed within the first event
                                var secondIsTimedWithinFirstEvent = false
                                //überschneidung
                                if (event.start >= prevEvent.start && event.end <= prevEvent.end) {
                                    secondIsTimedWithinFirstEvent = true;
                                    generateEvents[date][newId] = this.CreateEvent("grey", date, "", "24:00", newId, prevEvent.end, "Generated Event", 1);
                                } else if (event.start >= prevEvent.start && event.start <= prevEvent.end && event.end > prevEvent.end) {
                                    generateEvents[date][newId] = this.CreateEvent("grey", date, "", "24:00", newId, end, "Generated Event");
                                }
                                else {
                                    secondIsTimedWithinFirstEvent = false
                                    generateEvents[date][newId] = this.CreateEvent("grey", date, "", start, newId, prevEvent.end, "Generated Event", 1);
                                }
                            }

                            if (i === currentEventsForDate.length - 1) {
                                newId = generateId();

                                if (secondIsTimedWithinFirstEvent) {
                                    generateEvents[date][newId] = this.CreateEvent("grey", date, "", "24:00", newId, prevEvent.end, "Generated Event", 1);
                                } else {
                                    generateEvents[date][newId] = this.CreateEvent("grey", date, "", "24:00", newId, end, "Generated Event", 1);
                                }
                            }
                        }
                    } else {
                        var event = currentEventsForDate[Object.keys(currentEventsForDate)[0]];
                        var start = event.start;
                        var end = event.end;
                        var date = event.date;

                        generateEvents[date] = {}
                        generateEvents[date][newId] = this.CreateEvent("grey", date, "", start, newId, "00:00", "Generated Event", 1);

                        newId = generateId();
                        generateEvents[date][newId] = this.CreateEvent("grey", date, "", "24:00", newId, end, "Generated Event", 1);
                    }
                }
            }
        }

        if (Object.keys(generateEvents).length > 0) {
            this.InsertEventsIntoMainObjectLstAllCalendarEntries(undefined, generateEvents);
            window.alert("Termine wurden angelegt.");
        } else {
            window.alert("Es wurden keine Termine angelegt, da es keinen freien Zeitraum gab.");
        }

        this.eventsLoaded = false;
        this.loadEvents();
    }

    CreateEvent = function (color, date, description, end, id, start, title, calendar_Type) {
        var tempPrevDate = new Date(date);
        var generateEvent = {};
        generateEvent[date] = {};

        var tempPrevDate = new Date(tempPrevDate.setDate(tempPrevDate.getDate() - 1));
        var year = tempPrevDate.getFullYear();
        var month = tempPrevDate.getMonth() + 1;
        var day = tempPrevDate.getDate().toString().length === 1 ? "0" + tempPrevDate.getDate() : tempPrevDate.getDate();

        return generateEvent[date][id] = {
            "color": color
            , "date": date
            , "description": description
            , "end": end
            , "id": id
            , "prevDate": year + '-' + month + '-' + day
            , "start": start
            , "title": title
            , 'calendar_type': calendar_Type
            , 'matchID': "0"
        }
    }

    InsertEventsIntoMainObjectLstAllCalendarEntries = function (userId, generateEvents) {
        if (userId === undefined) {
            Object.keys(lstAllCalendarEntriesByUser).forEach(key => {
                this.InsertEventsIntoMainObjectLstAllCalendarEntriesByUser(key, generateEvents);
            });
        }
        else {
            this.InsertEventsIntoMainObjectLstAllCalendarEntriesByUser(userId, generateEvents); // TODO:  1 = userId
        }

        this.loadEvents();
    }

    InsertEventsIntoMainObjectLstAllCalendarEntriesByUser = function (key, generateEvents) {
        Object.keys(generateEvents).forEach(date => {
            if (lstAllCalendarEntriesByUser[key]["events"][date] === undefined) {
                lstAllCalendarEntriesByUser[key]["events"][date] = {};
                lstAllCalendarEntriesByUser[key]["events"][date] = generateEvents[date];
                var req = {};
                req[key] = {
                    "userName": ""
                    , "events": {}
                };
                req[key]["events"][date] = {
                    "zwXPQTUx3PJCPx8h24xC": {
                        "color": generateEvents.color
                        , "date": date
                        , "description": generateEvents.description
                        , "end": generateEvents.end
                        , "id": generateEvents.id
                        , "prevDate": generateEvents.prevDate
                        , "start": generateEvents.start
                        , "title": generateEvents.title
                    }
                };

                console.log(req);
            }
            else {
                Object.keys(generateEvents[date]).forEach(eventId => {
                    lstAllCalendarEntriesByUser[key]["events"][date][eventId] = {};
                    lstAllCalendarEntriesByUser[key]["events"][date][eventId] = generateEvents[date][eventId];
                });
            }
        });
    }

    DeleteEventFromLstAllCalendarEntriesByUser = function (userId, date, id) {
        delete lstAllCalendarEntriesByUser[userId]["events"][date][id];
    }
}

