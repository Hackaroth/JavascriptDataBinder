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
 
export default class DOMElement {

    element = null;
    defaultValue = undefined;

    constructor(element) {
        this.element = element;

        if (this.element.id.trim() === '') {
            throw 'Element must have an id';
        }
    }

    get id() {
        return this.element.id;
    }

    get field() {
        return this.element.dataset.field;
    }

    set value(v) {
        if (this.defaultValue === undefined) {
            this.defaultValue = v;
        }

        this._setValue(v);
    }

    get value() {
        return this._getValue();
    }

    get changed() {
        return this._isChanged();
    }

    _setValue(value) {
        throw 'Cannot call abstract method';
    }

    _getValue() {
        throw 'Cannot call abstract method';
    }	

    _isChanged() {
        throw 'Cannot call abstract method';
    }

    rollback() {
        throw 'Cannot call abstract method';
    }
}

