/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	randomInt,
};