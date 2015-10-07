export default class FrameFactory {
    constructor() {
        'ngInject';

        var Frame = function(id, holder) {

            if(!id) {
                throw new Error('You must define an unique ID as a first attribute!');
            }

            if(!holder) {
                throw new Error('You must define a holder as a second attribute!');
            }

            if(typeof id !== 'string') {
                throw new TypeError('ID need to be a string!');
            }

            if(typeof holder !== 'string') {
                throw new TypeError('Holder need to be a string!');
            }

            this.id = id;
            this.holder = document.querySelector(holder);
            this.coordinates = [];

            if(this.holder === null) {
                throw new Error('Could not find DOM element: ' + holder);
            }

        };

        Frame.prototype.setCoordinates = function(coordinates, tool) {

            /**
             * Which tool will be used?
             * Pen (0) or rubber (1)?
             * @type {*|number}
             */
            tool = tool || 0;

            if(!coordinates || !coordinates instanceof Object) {
                throw new Error('Invalid coordinates!');
            }

            var criteria = {
                inArray: coordinates.inArray,
                inLed: coordinates.inLed
            };

            /**
             * Check if the given point
             * already exists in collection.
             * @type {*}
             */
            var find = _.findWhere(this.coordinates, criteria);

            /**
             * If not, we need to push it
             * to this collection.
             */
            if(!find) {
                if(tool === 0)
                this.coordinates.push(coordinates);
            } else {
                /**
                 * Or if exists and the used 'tool'
                 * is not a pen (0), remove this point
                 * from our collection.
                 */
                if(tool !== 0) {
                    this.coordinates = this.coordinates.filter(function(value) {
                        return value.inArray !== criteria.inArray && value.inLed !== criteria.inLed;
                    });
                }
            }
        };

        /**
         * Return 'coordinates'
         * @returns {Array|Array.<T>|*}
         */
        Frame.prototype.getCoordinates = function() {
            return this.coordinates;
        };

        /**
         * This method is outdated (to be deleted soon).
         * @param collection
         */
        Frame.prototype.setLEDArray = function(collection) {
            this.LEDArray.length = 0;
            this.LEDArray = collection;
        };

        /**
         * This method is outdated (to be deleted soon).
         * @returns {*}
         */
        Frame.prototype.getLEDArray = function() {
            return this.LEDArray;
        };

        return Frame;
    }
}
