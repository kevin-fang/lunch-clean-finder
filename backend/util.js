Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

// convert any format text to a name
// kevin FAng => Kevin Fang
String.prototype.nameify = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}