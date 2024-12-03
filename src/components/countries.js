import * as isoCountries from "i18n-iso-countries";
import arLocale from "i18n-iso-countries/langs/ar.json";

isoCountries.registerLocale(arLocale);

export const countries = isoCountries.getNames("ar");
