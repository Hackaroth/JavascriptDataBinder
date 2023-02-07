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
 
export default class DateTimeManagerLuxon {
	
    static LOCALE = 'it';
    static DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
    static DATE_FORMAT = 'yyyy-MM-dd';

	static isValid(value) {
        let result = null;
        if (window.luxon === undefined) {
            throw new Error("Luxon not available");
        }
        else {
            result = luxon.DateTime.fromISO(value, { locale: this.LOCALE }).isValid;
        }        

        return result;
    }

    static convertToLocalString(value, type) {
        let result = null;

        if (window.luxon === undefined) {
            throw new Error("Luxon not available");
        }
        else {

            let dt = luxon.DateTime.fromISO(value, { locale: this.LOCALE });

            if (type === "datetime-local")
                result = dt.toFormat(this.DATETIME_FORMAT);
            else if (type === "date")
                result = dt.toFormat(this.DATE_FORMAT);
        }  

        return result;
	}

	static convertToISOString(value) {
        let result = null;

        if (window.luxon === undefined) {
            throw new Error("Luxon not available");
        }
        else {
            result = luxon.DateTime.fromISO(value, { locale: this.LOCALE }).toUTC().toISO();
        }        

        return result;
	}
}