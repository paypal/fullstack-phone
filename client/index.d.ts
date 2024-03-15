import type {
  RegionCode,
  Meta,
  CountryCallingCodeNumeric,
  CountryCodeToRegionCodeMap,
} from '../server';

interface PhoneObj {
  countryCode: string;
  nationalNumber: string;
  extension?: string;
}

type PhoneNumberType =
  | 'FIXED_LINE'
  | 'MOBILE'
  | 'FIXED_LINE_OR_MOBILE'
  | 'TOLL_FREE'
  | 'PREMIUM_RATE'
  | 'SHARED_COST'
  | 'VOIP'
  | 'PERSONAL_NUMBER'
  | 'PAGER'
  | 'UAN'
  | 'VOICEMAIL'
  | 'UNKNOWN';

interface FormatOptions {
  style: 'e164' | 'international' | 'national' | 'rfc3966';
}

type FullPhoneValidationErrorMessage = 'PHONE_INVALID_FOR_REGION'
  | 'PHONE_INVALID_COUNTRY_CODE'
  | 'PHONE_NUMBER_TOO_LONG'
  | 'PHONE_NUMBER_TOO_SHORT'
  | 'PHONE_NUMBER_INVALID_LENGTH';

interface FullValidationError extends Error {
  message: FullPhoneValidationErrorMessage;
}

interface LengthValidationError extends Error {
  message: FullPhoneValidationErrorMessage | 'PHONE_NUMBER_POSSIBLE_LOCAL_ONLY';
}

interface ParseError extends Error {
  message:
  | 'PHONE_INVALID_COUNTRY_CODE'
  | 'PHONE_NUMBER_TOO_SHORT'
  | 'PHONE_NUMBER_TOO_LONG'
  | 'PHONE_NOT_A_NUMBER'
  | 'PHONE_TOO_SHORT_AFTER_IDD';
}

interface PhoneHandler {
  /**
   * Return the list of region codes supported by the loaded metadata
   */
  getSupportedRegions: () => Array<RegionCode>;

  /**
   * Return the country calling code for a particular region code
   */
  getCountryCodeForRegion: (regionCode: RegionCode) => CountryCallingCodeNumeric;

  /**
   * Return a map of country calling codes to arrays of regions
   */
  countryCodeToRegionCodeMap: () => CountryCodeToRegionCodeMap;

  /**
   * Return the type of a (valid) phone number
   */
  inferPhoneNumberType: (phoneObj: PhoneObj) => PhoneNumberType;

  /**
   * Return the region of a (valid) phone number
   * or null if the region cannot be determined
   */
  inferPhoneNumberRegion: (phoneObj: PhoneObj) => RegionCode | null;

  /**
   * Format a phone number according to the given style
   */
  formatPhoneNumber: (phoneObj: PhoneObj, options: FormatOptions) => string;

  /**
   * Indicate whether the given phone number is valid for the given region
   * If regionCode is omitted, the phone number is checked against all possible regions loaded in the metadata
   */
  validatePhoneNumber: (phoneObj: PhoneObj, regionCode?: RegionCode) => true | FullValidationError;

  /**
   * Indicate whether the given phone number is "possible" for the region (i.e., whether it adheres to length constraints)
   * (More lenient than validatePhoneNumber)
   * If regionCode is omitted, it is checked against all regions loaded in the metadata
   */
  validateLength: (phoneObj: PhoneObj, regionCode?: RegionCode) => true | LengthValidationError;

  /**
   * Parse a phone number string for the given region and return a phoneObj
   */
  parsePhoneNumber: (phoneNumberToParse: string, regionCode?: RegionCode) => PhoneObj | ParseError;

  /**
   * Return an example phone number for a given type and region
   * or null if an example does not exist
   */
  getExampleNumberForType: (type: PhoneNumberType, regionCode: RegionCode) => PhoneObj | null;

  /**
   * Return an as-you-type formatter instantiated for the given region
   */
  getAsYouTypeFormatter: (regionCode: RegionCode) => AsYouTypeFormatter;
}

interface AsYouTypeFormatter {
  /**
   * Input a single character
   * Returns the formatted output so far
   */
  inputDigit: (x: number | string) => string;

  /**
   * Clear the formatter
   */
  clear: () => void;

  /**
   * Input a single char and remember the position
   */
  inputDigitAndRememberPosition: (x: number | string) => string;

  /**
   * Return the remembered position as a number
   */
  getRememberedPosition: () => number;
}

/**
 * Return a phone handler initialized for the given metadata bundle
 */
export function createPhoneHandler(meta: Meta): PhoneHandler;
