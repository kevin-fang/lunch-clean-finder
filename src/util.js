String.prototype.nameify = function() {
    if (this.includes('-')) { // capitalize text after hyphen if needed
        var idx = this.indexOf('-') + 1 // get text after hyphen
        // capitalize first letter, lower case until the hyphen, and then recursively nameify that
        return this.charAt(0).toUpperCase()
            + this.substring(1, idx).toLowerCase()
            + this.substring(idx).nameify()
    } else {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }
}

Date.prototype.isToday = function() {
	this.setHours(0, 0, 0, 0)
	var today = new Date()
	today.setHours(0, 0, 0, 0)
	return this.valueOf() === today.valueOf()
}