const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, location, maxAttendees } = req.body;

  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const event = {
      title,
      description,
      date: new Date(date),
      location,
      maxAttendees: maxAttendees || 100,
      createdBy: req.user.userId,
      createdByUsername: req.user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(event);

    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertedId,
      event: { ...event, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Create event error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listEvents = async (_req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const events = await eventsCollection.find({}).sort({ date: 1 }).toArray();

    res.json({ events, total: events.length });
  } catch (err) {
    console.error("List events error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const db = getDB();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event });
  } catch (err) {
    console.error("Get event error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const db = getDB();
    const eventsCollection = db.collection("events");

    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const { title, description, date, location, maxAttendees } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(date && { date: new Date(date) }),
      ...(location && { location }),
      ...(maxAttendees && { maxAttendees }),
      updatedAt: new Date(),
    };

    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    const updatedEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error("Update event error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createEvent, listEvents, getEvent, updateEvent };
