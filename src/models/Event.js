const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ location: "2dsphere" });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });

// Virtual for duration
eventSchema.virtual("duration").get(function () {
  return this.endDate - this.startDate;
});

// Method to update average rating
eventSchema.methods.updateRating = async function (rating) {
  this.totalRatings += 1;
  this.averageRating =
    (this.averageRating * (this.totalRatings - 1) + rating) / this.totalRatings;
  await this.save();
};

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
