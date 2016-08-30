/**
 * Created by alexa on 21.08.2016.
 */
/**
 * Get a random number between range
 * @param {integer}
 * @param {integer}
 */
function rand(low, high) {
    return Math.floor( Math.random() * (high - low + 1) + low );
}
/**
 * Something counter
 **/
function counter() {
    var privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }
    return {
        increment: function() {
            changeBy(1);
        },
        decrement: function() {
            changeBy(-1);
        },
        value: function() {
            return privateCounter;
        }
    };
}

function getRandomEntityIdsSubArray(arr, size) {
    var copy = arr.slice(0), rand = [];
    for (var i = 0; i < size && i < copy.length; i++) {
        var index = Math.floor(Math.random() * copy.length);
        var entity = copy.splice(index, 1)[0];
        if (entity instanceof Entity)
            rand.push(entity.id);
    }
    return rand;
}