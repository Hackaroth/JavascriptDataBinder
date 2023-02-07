/*
 * Javascript Data Binder
 * Copyright (C) 2023 Stefano BARILETTI <hackaroth@gmail.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
 
import InputElement from "./InputElement.js";

export default class DatetimeInputElement extends InputElement {

    dateTimeManager = null;

    constructor(element, dateTimeManager) {
        super(element);

        if (dateTimeManager === null || dateTimeManager === undefined)
            throw new Error("DateTime manager cannot be null or undefined")

        this.dateTimeManager = dateTimeManager;
    }

    _setValue(value) {
        if (value !== undefined) {

            if (value === null || (typeof (value) === 'string' && value.trim() === ""))
                this.element.value = null
            else if (this.dateTimeManager.isValid(value)) {
                this.element.value = this.dateTimeManager.convertToLocalString(value, this.element.type);
            } else
                throw new TypeError("Invalid date")
        }
    }

    _getValue() {
        let result = null;

        if (this.element.value.trim() !== "")
            result = this.dateTimeManager.convertToISOString(this.element.value.trim());

        return result;
    }
}

