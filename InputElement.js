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
 
import DOMElement from "./DOMElement.js";

export default class InputElement extends DOMElement {

    #events = {}

    constructor(element) {
        super(element);
    }

    _setValue(value) {
        if (value !== undefined)
            this.element.value = value;
    }

    _getValue() {

        let result = this.element.value;

        if (this.element.type === "number") {
            if (result.trim() === "") {
                result = null;
            } else if (Number.isInteger(result)) {
                result = parseInt(result);
            } else {
                result = parseFloat(result);
            }
        }

        return result;
    }

    _isChanged() {
        return this.value != this.defaultValue;
    }

    rollback() {
        this.value = this.defaultValue;
        this.trigger('rollback');
    }

    trigger(eventName) {

        let result = false;

        if (this.#events[eventName] !== undefined) {
            this.#events[eventName].forEach(callBack => {
                callBack(this);
            });

            result = true;
        }

        return result;
    }

    on(eventName, callBack) {
        if (this.#events[eventName] === undefined) {
            this.#events[eventName] = [];
        }

        this.#events[eventName].push(callBack);
    }

    off(eventName) {
        if (eventName === undefined) {
            this.#events = {};
        } else {
            this.#events[eventName] = undefined;
        }

    }
}
