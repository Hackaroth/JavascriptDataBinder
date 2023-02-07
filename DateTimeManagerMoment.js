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
 
export default class DateTimeManagerMoment {
	
    static LOCALE = 'it';
    static DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    static DATE_FORMAT = 'YYYY-MM-DD';

	static isValid(value) {
        let result = null;

        if (window.moment === undefined) {
            throw new Error("Moment not available");
        }
        else {
            result = moment(value).isValid();
        }        

        return result;
	}

	static convertToLocalString(value, type) {
        let result = null;

        if (window.moment === undefined) {
            throw new Error("Moment not available");
        }
        else {
            if (type === "datetime-local")
                result = moment(value).format(this.DATETIME_FORMAT);
            else if (type === "date")
                result = moment(value).format(this.DATE_FORMAT);
        }  

        return result;
	}

	static convertToISOString(value) {
        let result = null;

        if (window.moment === undefined) {
            throw new Error("Moment not available");
        }
        else {
            result = moment(value).toISOString();
        }        

        return result;
	}
}