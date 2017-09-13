import React from 'react'

String.prototype.nameify = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

export function MakeTableRow(day) {
    return (
        <div>
            | {day.date} | {day.weekday} | {day.team} | {day.notes && day.notes + " |"} 
        </div>
    )
}