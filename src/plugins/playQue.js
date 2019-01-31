import Dexie from 'dexie';
import {
  EventBus
} from "@/event-bus.js";
import * as _ from "lodash";

const db = new Dexie('RoadieDatabase');
db.version(1).stores({
  tracks: '++index,&id'
});

class PlayQue {

  constructor(db) {
    this._db = db;
  }

  list(offset, limit, doShuffle) {
    // Return paged collection from db
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: false,
        tracks: [],
        totalCount: 0
      };
      if (doShuffle) {
        that._db.tracks.where('index').above(0).toArray()
          .then(function (array) {
            let r = [];
            let looper = offset;
            array = _.shuffle(array);
            array.forEach(tr => {
              looper++;
              if (looper <= limit) {
                r.push({
                  listNumber: looper,
                  track: tr
                });
              }
            })
            result.isSuccess = true;
            result.tracks = r;
            return that.trackCount();
          })
          .then(function (trackCount) {
            result.totalCount = trackCount.totalCount;
          })
          .then(() => {
            resolve(result);
          });
      } else {
        that._db.tracks.where('index').above(0).offset(offset).limit(limit).sortBy('index')
          .then(function (array) {
            const r = [];
            let looper = offset;
            array.forEach(tr => {
              looper++;
              r.push({
                listNumber: looper,
                track: tr
              });
            })
            result.isSuccess = true;
            result.tracks = r;
            return that.trackCount();
          })
          .then(function (trackCount) {
            result.totalCount = trackCount.totalCount;
          })
          .then(() => {
            resolve(result);
          });
      }
    })
  }

  trackByIndex(index) {
    // Get track from db by track.index
    const that = this;
    return new Promise(resolve => {
      that._db.tracks.where('index').equals(index).first()
        .then(function (track) {
          resolve({
            isSuccess: true,
            track: track
          });
        })
    })
  }

  track(trackId) {
    // Get track from db by track.id
    const that = this;
    return new Promise(resolve => {
      that._db.tracks.where('id').equals(trackId).first()
        .then(function (track) {
          resolve({
            isSuccess: track && track.id === trackId,
            track: track
          });
        })
    })
  }

  add(tracks) {
    // Put tracks in db
    const that = this;
    return new Promise(resolve => {
      const noTrackMessage = "No Tracks To Add";
      const result = {
        isSuccess: false,
        message: null,
      }
      if (!Array.isArray(tracks) || !tracks.length) {
        result.message = noTrackMessage;
        resolve(result);
      }
      // Get unique tracks that are not already in db
      that._db.tracks.where('id').anyOf(_.map(tracks, function(track) { return track.id; })).toArray()
      .then(tracksInDb => {
        return _.differenceWith(tracks, tracksInDb, function(t, t1) { return t.id === t1.id; });
      })
      .then(tracksToAdd => {
        if (tracksToAdd.length > 0) {
          result.addedCount = tracksToAdd.length;          
          return that._db.tracks.bulkPut(tracksToAdd);
        }
      })
      .then(() => {
        return this.trackCount();
      })
      .then(trackCount => {
        result.isSuccess = true;
        result.totalCount = trackCount.totalCount;          
        result.message = result.addedCount > 0 ? result.message : noTrackMessage;
        resolve(result);
      })
      .finally(() => {
        EventBus.$emit("q:addedTracksToQue", result);                    
      })
    })
  }

  delete(trackIds) {
    // Remove track from db
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: true,
        deleteCount: 0
      }      
      that._db.tracks.where('id').anyOf(trackIds).delete()
      .then(count => {
        result.deleteCount = count;
        resolve(result);
      })
      .finally(() => {
        setTimeout(function() {
          EventBus.$emit("q:deletedTrackFromQue", result);          
        }, 2000);
      });
    })
  }

  deleteAll() {
    // Remove All tracks from db
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: true,
        deleteCount: 0,
        totalCount: 0
      }
      that._db.tracks.where('id').above(0).delete()
      .then(function (count) {
        result.deleteCount = count;
        resolve(result);
      })
      .finally(() => {
        EventBus.$emit("q:deletedAllTrackFromQue", result);          
      });
    })
  }

  firstTrack() {
    // Return the first track in the db
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: false,
        firstTrackIndex: 0,
        lastTrackIndex: 0,
        track: null
      };
      that._db.tracks.where('index').above(0).first()
        .then(function (first) {
          result.firstTrackIndex = first ? first.index : null;
          result.isSuccess = first && first.id.length > 0;
          result.track = first;
          return that._db.tracks.where('index').above(0).last();
        })
        .then(function (last) {
          result.lastTrackIndex = last ? last.index : null;
          resolve(result);
        });
    })
  }

  lastTrack() {
    // Return the last track in the db
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: false,
        firstTrackIndex: 0,
        lastTrackIndex: 0,
        track: null
      };
      that._db.tracks.where('index').above(0).last()
        .then(function (last) {
          result.isSuccess = last && last.id.length > 0;
          result.lastTrackIndex = last ? last.index : null;
          return that._db.tracks.where('index').above(0).first();
        })
        .then(function (first) {
          result.firstTrackIndex = first ? first.index : null;
          resolve(result);
        });
    })
  }

  trackCount() {
    // Return the total number of tracks in the db
    const that = this;
    return new Promise(resolve => {
      that._db.tracks.where('index').above(0).count()
        .then(function (count) {
          resolve({
            isSuccess: true,
            totalCount: count
          });
        })
    })
  }

  trackTimeToIndex(index) {
    // Return total play time from 0 to index
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: false,
        time: 0
      };      
      that._db.tracks.where('index').above(0).toArray()
        .then(function (tracks) {
          _.takeWhile(tracks, function(tr){ return tr.index < index; }).forEach(tr => {
            result.time += tr.duration;
          });
          return result;
        })
        .then(function(result) {
          resolve(result);
        })
    })    
  }

  totalTime() {
    // Return total play time of db in milliseconds
    const that = this;
    return new Promise(resolve => {
      const result = {
        isSuccess: false,
        firstTrackIndex: 0,
        lastTrackIndex: 0,
        totalTime: 0
      };
      that._db.tracks.where('index').above(0).toArray()
        .then(function (tracks) {
          tracks.forEach(tr => {
            result.totalTime += tr.duration;
          });
          return that._db.tracks.where('index').above(0).last();
        })
        .then(function (last) {
          result.isSuccess = last && last.id.length > 0;
          result.lastTrackIndex = last ? last.index : null;
          return that._db.tracks.where('index').above(0).first();
        })
        .then(function (first) {
          result.firstTrackIndex = first ? first.index : null;
        })
        .finally(() => {
          resolve(result);
        });
    })
  }
}

export default {
  install(Vue) {
    // Vue.mixin({
    //   mounted() {
    //     console.log('Mounted!');
    //   }
    // });  
    Vue.prototype.$playQue = new PlayQue(db);
  }
}