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
 
export default class DateTimeManager {
	
    static LOCALE = 'it';
    static DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    static DATE_FORMAT = 'YYYY-MM-DD';

	static isValid(value) {
        let result = false;

        if (typeof (value) === 'string') {
            let date = new Date(value);
            result = date instanceof Date && !isNaN(date);
        }

        return result;
	}

	static convertToLocalString(value, type) {
        let result = null;
        let date = new Date(value);
        let local_date_iso_string = new Date(date.getTime() + date.getTimezoneOffset() * -60 * 1000).toISOString();

        if (type === "datetime-local")
            result = local_date_iso_string.slice(0, 19);
        else if (type === "date")
            result = local_date_iso_string.slice(0, 10);

        return result;
	}

	static convertToISOString(value) {
		return new Date(value).toISOString();
	}
}