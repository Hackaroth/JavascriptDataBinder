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

export default class CheckboxInputElement extends InputElement {
    constructor(element) {
        super(element);
    }

    _setValue(value) {
        this.element.checked = (value == 1);
    }	

    _getValue() {
        return this.element.checked ? 1 : 0;
    }
}
