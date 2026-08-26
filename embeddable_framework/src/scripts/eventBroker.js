'use strict'

var EventBroker={
    Init:function() {
        this._eventMap={};
        this._HardCodeCB=null;
        this.subscribe=function(eventId,callbackFunc) {
            _eventMap[eventId]=callbackFunc;
            this._HardCodeCB=callbackFunc;
        };
        this.receiveEvent=function(eventId,data) {
            // extract Event
            if(this._HardCodeCB) {
                console.log(`Triggering Callback`);
                _HardCodeCB(data);
            }
        }
    }
}