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
 
import DOMElementFactory from "./DOMElementFactory.js";
import DateTimeManager from "./DateTimeManager.js";
import ObservedObject from "./ObservedObject.js";

export default class DataBinder {

    container = null;
    dataSource = null;
    observedDataSource = null;
    elements = {
        [Symbol.iterator]: function* () {
            for (let k in this) {
                yield this[k];
            }
        }
    };
    
    onChange = null;

    #formatters = {}

    static dateTimeManager = DateTimeManager;

    constructor(container) {
        this.container = container;
        this.#selectElements();
    }

    #selectElements() {

        let elements = this.container.querySelectorAll('[data-field]');

        elements.forEach(element => {
            this.#addElement(element);
        });
    }

    #addElement(element) {
        let dom_element = this.#createDOMElement(element);

        if (dom_element !== null) {

            this.#addDOMElement(dom_element);
            
            let self = this;

            element.addEventListener('change', (e) => {

                self.#setFieldValue(dom_element.field, dom_element.value);

                let triggered = false;

                if (dom_element.trigger !== undefined)
                    triggered = dom_element.trigger('change');

                if (!triggered && self.onChange !== null) {
                    self.onChange(dom_element);
                }

                this.refresh();
            });

            if (dom_element.on !== undefined) {
                dom_element.on('rollback', (element) => {
                    this.#setFieldValue(dom_element.field, element.value);
                    this.refresh();
                })
            }
        }
    }
    
    #createDOMElement(element) {
        
        let result = null;
        
        switch (element.nodeName) {

            case 'INPUT':
                switch (element.type) {
                    case 'checkbox':
                        result = DOMElementFactory.getCheckboxInputElement(element);
                        break;

                    case 'date':
                    case 'datetime-local':
                        result = DOMElementFactory.getDatetimeInputElement(element, DataBinder.dateTimeManager);
                        break;

                    default:
                        result = DOMElementFactory.getInputElement(element);
                        break;
                }

                break;


            case 'TEXTAREA':
                result = DOMElementFactory.getInputElement(element);
                break;

            case 'SELECT':
                result = DOMElementFactory.getSelectElement(element);
                break;

            case 'A':
                result = DOMElementFactory.getATextElement(element);
                break;

            default:
                result = DOMElementFactory.getTextElement(element);
                break;
        } 
        
        return result;
    }
    
    #addDOMElement(domElement) {
        if (this.elements[domElement.id] !== undefined) {
            throw 'An element with id ' + domElement.id + ' already exists';
        }

        this.elements[domElement.id] = domElement;        
    }

    addFormatter(formatterName, callback) {
        this.#formatters[formatterName] = callback;
    }

    bind(dataSource) {
        this.dataSource = this.#createDataSourceObserver(dataSource);
        this.refresh();

        return this.dataSource;
    }

    #createDataSourceObserver(dataSource) {
        let self = this;

        let result = ObservedObject.build(dataSource, function (observedObject, key, value) {
            let elements = self.#getDOMElementsByField(key);

            elements.forEach(element => {
                self.#setDOMElementValue(element, value);
            })
        });

        return result;
    }

    refresh() {
        for (let dom_element of this.elements) {

            let value = this.#getFieldValue(dom_element.field);

            this.#setDOMElementValue(dom_element, value);
        }
    }

    #getDOMElementsByField(field) {

        let result = [];

        for (let dom_element of this.elements) {

            if (dom_element.field === field) {
                result.push(dom_element);
            }
        }

        return result;
    }

    #setDOMElementValue(domElement, value) {
        if (domElement.element.dataset.formatter !== undefined) {
            value = this.#formatValue(domElement.element.dataset.formatter, value);
        }

        domElement.value = value;        
    }

    #setFieldValue(field, value) {
        let data_source = this.dataSource;
        let fields = field.split('.');

        if (fields.length > 1) {
            for (let i = 0; i < fields.length - 1; i++ ) {
                data_source = data_source[fields[i]];
            }

            field = fields[fields.length - 1];
        }

        data_source[field] = value;
    }

    #getFieldValue(field) {
        let result = null;
        let data_source = this.dataSource;

        let fields = field.split('.');

        fields.forEach(f => {
            if (data_source != null) {
                result = data_source[f];
                data_source = data_source[f];
            }
        })

        return result;
    }

    #formatValue(formatterName, value) {
        let result = value;

        if (this.#formatters[formatterName] !== undefined) {
            result = this.#formatters[formatterName](value);
        }

        return result;
    }

    getElement(elementId) {

        let result = null;

        if (this.elements[elementId] !== undefined)
            result = this.elements[elementId];

        return result;
    }

    getChangedValues() {
        let result = {};

        for (let dom_element of this.elements) {

            if (dom_element.changed) {

                let fields = dom_element.field.split('.');

                if (fields.length > 1) {
                    let temp = result;
                    for (let i = 0; i < fields.length - 1; i++) {
                        if (temp[fields[i]] === undefined)
                            temp[fields[i]] = {}
                        temp = temp[fields[i]];
                    }

                    temp[fields[fields.length - 1]] = dom_element.value;    
                }
                else if (fields.length == 1) {
                    result[dom_element.field] = dom_element.value;    
                }
            }
        }

        if (Object.keys(result).length == 0) {
            result = null;
        }

        return result;
    }

    cancelChanges() {
        for (let dom_element of this.elements) {
            
            if (dom_element.changed) {
                dom_element.rollback();
            }
        }
    }
    
    getRequiredFields() {
        
        let result = [];
        
        for (let dom_element of this.elements) {

            if (dom_element.element.required) {
                result.push(dom_element);
            }
        }        
        
        return result;
    }
    
    getUnsetRequiredFields() {
        
        let result = [];
        
        for (let dom_element of this.elements) {

            if (dom_element.element.required) {
                
                if (dom_element.value === null || dom_element.value.trim() === "") {
                    result.push(dom_element);
                }
            }
        }        
        
        return result;
    }

    toJSON() {
        return JSON.stringify(this.dataSource);
    }

    toObject() {
        return JSON.parse(this.toJSON());
    }
}