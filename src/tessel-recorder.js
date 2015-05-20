import {compress, uncompress} from '../lib/gzip';

export class TesselRecorder {
  constructor(tesselContext) {
    this.context = tesselContext;
    this.recording = false;
    this.stateRecords = undefined;

    this.replaying = false;

    // Add listener
    this.context._internal[1].on('update', () => {
      if (this.recording == true) {
        this.addRecord(this.context.internalData);
      }
    })
  }

  isRecording() {
    return this.recording;
  }

  isReplaying() {
    return this.replaying;
  }

  startRecording() {
    console.debug("Start recording");
    this.recording = true;
    this.stateRecords = [];

    var currentTesselState = this.context.get();
    this.addRecord(currentTesselState);

  }

  addRecord(state) {
    console.debug("Adding record", state);

    this.stateRecords.push({
        time: Date.now(),
        state: state
    });
  }

  stopRecording() {
    this.recording = false;
    // Remove listener
    this.context._internal[1].off('update', this._listenContext)
  }

  replayStateRecord(record) {
    this.context.set(record.state);
  }

  step(step) {
    this.replayStateRecord(this.stateRecords[step]);
  }

  replay(speedFactor) {
    if ( !this.stateRecords || this.stateRecords.length < 1 ) {
        console.error("At least 2 records are needed to replay");
        return;
    }

    try {
        this.replaying = true;
        var speedFactor = speedFactor || 1;
        var firstRecord = this.stateRecords[0];
        var lastRecord = this.stateRecords[this.stateRecords.length - 1];
        var totalRecordTime = lastRecord.time - firstRecord.time;

        var records = this.stateRecords.map(function(record) {
            // How much time after the beginning this record was added
            var startOffset = record.time - firstRecord.time;
            return {
                record: record,
                offset: startOffset
            }
        });

        // The current time is actually affected by the speed factor
        var currentReplayTime = 0;
        var currentRecordIndex = 0;
        var tickPace = 10; // TODO which value to choose?
        var replayInterval = setInterval(function() {
            this.replayStateRecord(records[currentRecordIndex].record);
            var hasNextRecord = (records.length > currentRecordIndex + 1);
            // TODO create replay widget and send events to this widget
            if ( hasNextRecord ) {
                var nextRecord = records[currentRecordIndex + 1];
                var isTimeToPlayNextRecord = nextRecord.offset <= currentReplayTime;
                if ( isTimeToPlayNextRecord ) {
                    currentRecordIndex = currentRecordIndex + 1;
                    console.debug("Playing to next record");
                }
                currentReplayTime = currentReplayTime + (tickPace * speedFactor);
            } else {
                console.debug("End of replay");
                clearInterval(replayInterval);
            }
        }.bind(this),tickPace);
    } catch (e) {
        console.error("Error during replay of state records", this.stateRecords,e);
        console.error(e.stack);
    } finally {
        this.replaying = false;
    }
  }

  dehydrate() {
    return compress(JSON.stringify(this.stateRecords));
  }

  rehydrate(data) {
    this.stateRecords = JSON.parse(uncompress(data));
  }
}
