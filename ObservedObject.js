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
 
export default class ObservedObject {
	
	#Observer = null;
	#onChange = null;
	#parentKey = "";

	constructor(object, onChange, parentKey) {
		let self = this;

		if (parentKey !== undefined)  {
			this.#parentKey = parentKey;
		}

		if (onChange !== undefined) {
			this.#onChange = onChange;
		}

		this.#Observer = new Proxy(object, {

            set: function (target, prop, changes) {

            	if (target[prop] !== changes) {

            		let key_path = ObservedObject.#buildKeyPath(self.#parentKey, prop);

			    	if (typeof(changes) === 'object' && changes !== null) {
			       		target[prop] = ObservedObject.build(changes, self.#onChange, key_path);
			    	}
			    	else {
			        	target[prop] = changes;
			    	}

	            	if (self.#onChange !== null) {
	            		self.#onChange(self, key_path, changes);
	            	}
				}

            	return true;
            }
        });
	}

	get observer() {
		return this.#Observer;
	}

	static #buildKeyPath(parentKey, key) {
		let result = "";

		if (parentKey !== undefined && parentKey !== "") {
			result = parentKey + "." + key;
		}
		else {
			result = key;
		}

		return result;
	}

	static build(object, onChange, parentKey) {

		let result = null;

		if (object !== null) {

			let observed_object = null;

			if (Array.isArray(object)) {

				let buffer = [];

				for (let i = 0; i < object.length; i++) {

					let item = object[i];

					if (typeof(item) === 'object' && item !== null) {

						let key_path = ObservedObject.#buildKeyPath(parentKey, i.toString());

						buffer.push(ObservedObject.build(item, onChange, key_path));
					}
					else {
						buffer.push(item);
					}
				};

				observed_object = new ObservedObject(buffer, onChange, parentKey);
			}
			else if (typeof(object) === 'object') {
				let temp = {}

				for (let key in object) {
					if (typeof(object[key]) === 'object') {
						let key_path = ObservedObject.#buildKeyPath(parentKey, key);

						temp[key] = ObservedObject.build(object[key], onChange, key_path)
					} 
					else {
						temp[key] = object[key];
					}
				}

	    		observed_object = new ObservedObject(temp, onChange, parentKey);
			}			
			else {
	    		observed_object = new ObservedObject(object, onChange, parentKey);
			}

			result = observed_object.observer;
		}

		return result;
	}
}