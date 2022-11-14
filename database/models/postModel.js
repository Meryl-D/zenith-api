import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from './userModel.js';

//Define a schema for Posts
const postSchema = new Schema({
  picture: {
    url: {
      type: String,
    },
    ext: {
      type: String
    }
  },
  location: {
    type: {
      type: String,
      // required: true,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      // required: true,
      validate: {
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
      }
    }
  },
  description: {
    type: String,
    minLenght: [2, 'Description is too short'],
    maxLength: [200, 'Description cannot exceed 200 characters'],
    // required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  visitDate: {
    type: Date,
    min: '1950-01-01',
    validate: {
      validator: validateMaxDate,
      message: 'Visit Date cannot be after today'
    }
  },
  modificationDate: {
    type: Date,
    default: Date.now
  },
  visible: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Create a geospatial index on the location property.
postSchema.index({ location: '2dsphere' });

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}

function validateMaxDate(value) {
  return value < new Date()
}

// Create a model
export default mongoose.model('Post', postSchema);