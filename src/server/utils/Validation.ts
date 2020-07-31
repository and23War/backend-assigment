import * as _ from 'lodash';

export class Validation {
  /**
   * Verify if value have content
   * @param value
   */
  static isValid(value: any): boolean {
    if (value === null || typeof value === undefined || value === '') {
      return false;
    }
    return true;
  }

  static isEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static requiredFields(object: any, fields: string[]): boolean {
    for (let i = 0; i < fields.length; ++i) {
      if (!Validation.isValid(object[fields[i]])) return false;
    }
    return true;
  }

  /**
   * Convert value to upper case
   * @param value: Value to change
   */
  static toUpperCase(value: string): string {
    return Validation.isValid(value) ? value.toUpperCase() : null;
  }

  static validateQuotes(value: string): string {
    return value.replace(/[\'\"]/g, '');
  }

  /**
   * Check if the value of the SKU is valid
   * @param value Sku value with verification code to verify
   */
  static ean13Check(value: string) {
    const valueToProcess = parseInt(value.slice(0, -1), 0).toString();
    let checksum = 0;
    const valueSplit = valueToProcess.split('').reverse();
    for (const pos in valueSplit) {
      checksum += parseInt(valueSplit[pos], 0) * (3 - 2 * (<any>pos % 2));
    }
    const verifyValue = (10 - (checksum % 10)) % 10;
    return `${valueToProcess}${verifyValue}` === value;
  }
}
