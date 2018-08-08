/**
 * MongoDB ObjectId type
 *
 * TODO: probably can be imported from:
 * import * as mongoose from 'mongoose';
 * mongoose.Schema.Types.ObjectId;
 */
export interface ObjectId {
  str: string;
  getTimestamp: () => Date;
  toString: () => string; // => “ObjectId(str)”
  valueOf: () => string; // => str
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}
