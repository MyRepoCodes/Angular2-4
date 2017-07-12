/* tslint:disable */
export interface TimeZone {
  windowsTimeZone: string;
  ianaTimeZone: string;
  text: string;
  [others: string]: any;
}
export const TIMEZONES: TimeZone[] = [
  {
    "windowsTimeZone": "Dateline Standard Time",
    "ianaTimeZone": "Etc/GMT+12",
    "abbr": "DST",
    "offset": -12.0,
    "isdst": false,
    "text": "(UTC-12:00) International Date Line West",
    "utc": [
      "Etc/GMT+12"
    ]
  },
  {
    "windowsTimeZone": "UTC-11",
    "ianaTimeZone": "Etc/GMT+11",
    "abbr": "U",
    "offset": -11.0,
    "isdst": false,
    "text": "(UTC-11:00) Coordinated Universal Time-11",
    "utc": [
      "Etc/GMT+11",
      "Pacific/Midway",
      "Pacific/Niue",
      "Pacific/Pago_Pago"
    ]
  },
  {
    "windowsTimeZone": "Hawaiian Standard Time",
    "ianaTimeZone": "Pacific/Honolulu",
    "abbr": "HST",
    "offset": -10.0,
    "isdst": false,
    "text": "(UTC-10:00) Hawaii",
    "utc": [
      "Etc/GMT+10",
      "Pacific/Honolulu",
      "Pacific/Johnston",
      "Pacific/Rarotonga",
      "Pacific/Tahiti"
    ]
  },
  {
    "windowsTimeZone": "Alaskan Standard Time",
    "ianaTimeZone": "America/Anchorage",
    "abbr": "AKDT",
    "offset": -8.0,
    "isdst": true,
    "text": "(UTC-09:00) Alaska",
    "utc": [
      "America/Anchorage",
      "America/Juneau",
      "America/Nome",
      "America/Sitka",
      "America/Yakutat"
    ]
  },
  {
    "windowsTimeZone": "Pacific Standard Time (Mexico)",
    "ianaTimeZone": "America/Tijuana",
    "abbr": "PDT",
    "offset": -7.0,
    "isdst": true,
    "text": "(UTC-08:00) Baja California",
    "utc": [
      "America/Santa_Isabel"
    ]
  },
  {
    "windowsTimeZone": "Pacific Standard Time",
    "ianaTimeZone": "America/Los_Angeles",
    "abbr": "PDT",
    "offset": -7.0,
    "isdst": true,
    "text": "(UTC-08:00) Pacific Time (US & Canada)",
    "utc": [
      "America/Dawson",
      "America/Los_Angeles",
      "America/Tijuana",
      "America/Vancouver",
      "America/Whitehorse",
      "PST8PDT"
    ]
  },
  {
    "windowsTimeZone": "US Mountain Standard Time",
    "ianaTimeZone": "America/Phoenix",
    "abbr": "UMST",
    "offset": -7.0,
    "isdst": false,
    "text": "(UTC-07:00) Arizona",
    "utc": [
      "America/Creston",
      "America/Dawson_Creek",
      "America/Hermosillo",
      "America/Phoenix",
      "Etc/GMT+7"
    ]
  },
  {
    "windowsTimeZone": "Mountain Standard Time (Mexico)",
    "ianaTimeZone": "America/Chihuahua",
    "abbr": "MDT",
    "offset": -6.0,
    "isdst": true,
    "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
    "utc": [
      "America/Chihuahua",
      "America/Mazatlan"
    ]
  },
  {
    "windowsTimeZone": "Mountain Standard Time",
    "ianaTimeZone": "America/Denver",
    "abbr": "MDT",
    "offset": -6.0,
    "isdst": true,
    "text": "(UTC-07:00) Mountain Time (US & Canada)",
    "utc": [
      "America/Boise",
      "America/Cambridge_Bay",
      "America/Denver",
      "America/Edmonton",
      "America/Inuvik",
      "America/Ojinaga",
      "America/Yellowknife",
      "MST7MDT"
    ]
  },
  {
    "windowsTimeZone": "Central America Standard Time",
    "ianaTimeZone": "America/Guatemala",
    "abbr": "CAST",
    "offset": -6.0,
    "isdst": false,
    "text": "(UTC-06:00) Central America",
    "utc": [
      "America/Belize",
      "America/Costa_Rica",
      "America/El_Salvador",
      "America/Guatemala",
      "America/Managua",
      "America/Tegucigalpa",
      "Etc/GMT+6",
      "Pacific/Galapagos"
    ]
  },
  {
    "windowsTimeZone": "Central Standard Time",
    "ianaTimeZone": "America/Chicago",
    "abbr": "CDT",
    "offset": -5.0,
    "isdst": true,
    "text": "(UTC-06:00) Central Time (US & Canada)",
    "utc": [
      "America/Chicago",
      "America/Indiana/Knox",
      "America/Indiana/Tell_City",
      "America/Matamoros",
      "America/Menominee",
      "America/North_Dakota/Beulah",
      "America/North_Dakota/Center",
      "America/North_Dakota/New_Salem",
      "America/Rainy_River",
      "America/Rankin_Inlet",
      "America/Resolute",
      "America/Winnipeg",
      "CST6CDT"
    ]
  },
  {
    "windowsTimeZone": "Central Standard Time (Mexico)",
    "ianaTimeZone": "America/Mexico_City",
    "abbr": "CDT",
    "offset": -5.0,
    "isdst": true,
    "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
    "utc": [
      "America/Bahia_Banderas",
      "America/Cancun",
      "America/Merida",
      "America/Mexico_City",
      "America/Monterrey"
    ]
  },
  {
    "windowsTimeZone": "Canada Central Standard Time",
    "ianaTimeZone": "America/Regina",
    "abbr": "CCST",
    "offset": -6.0,
    "isdst": false,
    "text": "(UTC-06:00) Saskatchewan",
    "utc": [
      "America/Regina",
      "America/Swift_Current"
    ]
  },
  {
    "windowsTimeZone": "SA Pacific Standard Time",
    "ianaTimeZone": "America/Bogota",
    "abbr": "SPST",
    "offset": -5.0,
    "isdst": false,
    "text": "(UTC-05:00) Bogota, Lima, Quito",
    "utc": [
      "America/Bogota",
      "America/Cayman",
      "America/Coral_Harbour",
      "America/Eirunepe",
      "America/Guayaquil",
      "America/Jamaica",
      "America/Lima",
      "America/Panama",
      "America/Rio_Branco",
      "Etc/GMT+5"
    ]
  },
  {
    "windowsTimeZone": "Eastern Standard Time",
    "ianaTimeZone": "America/New_York",
    "abbr": "EDT",
    "offset": -4.0,
    "isdst": true,
    "text": "(UTC-05:00) Eastern Time (US & Canada)",
    "utc": [
      "America/Detroit",
      "America/Havana",
      "America/Indiana/Petersburg",
      "America/Indiana/Vincennes",
      "America/Indiana/Winamac",
      "America/Iqaluit",
      "America/Kentucky/Monticello",
      "America/Louisville",
      "America/Montreal",
      "America/Nassau",
      "America/New_York",
      "America/Nipigon",
      "America/Pangnirtung",
      "America/Port-au-Prince",
      "America/Thunder_Bay",
      "America/Toronto",
      "EST5EDT"
    ]
  },
  {
    "windowsTimeZone": "US Eastern Standard Time",
    "ianaTimeZone": "America/Indianapolis",
    "abbr": "UEDT",
    "offset": -4.0,
    "isdst": true,
    "text": "(UTC-05:00) Indiana (East)",
    "utc": [
      "America/Indiana/Marengo",
      "America/Indiana/Vevay",
      "America/Indianapolis"
    ]
  },
  {
    "windowsTimeZone": "Venezuela Standard Time",
    "ianaTimeZone": "America/Caracas",
    "abbr": "VST",
    "offset": -4.5,
    "isdst": false,
    "text": "(UTC-04:30) Caracas",
    "utc": [
      "America/Caracas"
    ]
  },
  {
    "windowsTimeZone": "Paraguay Standard Time",
    "ianaTimeZone": "America/Asuncion",
    "abbr": "PST",
    "offset": -4.0,
    "isdst": false,
    "text": "(UTC-04:00) Asuncion",
    "utc": [
      "America/Asuncion"
    ]
  },
  {
    "windowsTimeZone": "Atlantic Standard Time",
    "ianaTimeZone": "America/Halifax",
    "abbr": "ADT",
    "offset": -3.0,
    "isdst": true,
    "text": "(UTC-04:00) Atlantic Time (Canada)",
    "utc": [
      "America/Glace_Bay",
      "America/Goose_Bay",
      "America/Halifax",
      "America/Moncton",
      "America/Thule",
      "Atlantic/Bermuda"
    ]
  },
  {
    "windowsTimeZone": "Central Brazilian Standard Time",
    "ianaTimeZone": "America/Cuiaba",
    "abbr": "CBST",
    "offset": -4.0,
    "isdst": false,
    "text": "(UTC-04:00) Cuiaba",
    "utc": [
      "America/Campo_Grande",
      "America/Cuiaba"
    ]
  },
  {
    "windowsTimeZone": "SA Western Standard Time",
    "ianaTimeZone": "America/La_Paz",
    "abbr": "SWST",
    "offset": -4.0,
    "isdst": false,
    "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
    "utc": [
      "America/Anguilla",
      "America/Antigua",
      "America/Aruba",
      "America/Barbados",
      "America/Blanc-Sablon",
      "America/Boa_Vista",
      "America/Curacao",
      "America/Dominica",
      "America/Grand_Turk",
      "America/Grenada",
      "America/Guadeloupe",
      "America/Guyana",
      "America/Kralendijk",
      "America/La_Paz",
      "America/Lower_Princes",
      "America/Manaus",
      "America/Marigot",
      "America/Martinique",
      "America/Montserrat",
      "America/Port_of_Spain",
      "America/Porto_Velho",
      "America/Puerto_Rico",
      "America/Santo_Domingo",
      "America/St_Barthelemy",
      "America/St_Kitts",
      "America/St_Lucia",
      "America/St_Thomas",
      "America/St_Vincent",
      "America/Tortola",
      "Etc/GMT+4"
    ]
  },
  {
    "windowsTimeZone": "Pacific SA Standard Time",
    "ianaTimeZone": "America/Santiago",
    "abbr": "PSST",
    "offset": -4.0,
    "isdst": false,
    "text": "(UTC-04:00) Santiago",
    "utc": [
      "America/Santiago",
      "Antarctica/Palmer"
    ]
  },
  {
    "windowsTimeZone": "Newfoundland Standard Time",
    "ianaTimeZone": "America/St_Johns",
    "abbr": "NDT",
    "offset": -2.5,
    "isdst": true,
    "text": "(UTC-03:30) Newfoundland",
    "utc": [
      "America/St_Johns"
    ]
  },
  {
    "windowsTimeZone": "E. South America Standard Time",
    "ianaTimeZone": "America/Sao_Paulo",
    "abbr": "ESAST",
    "offset": -3.0,
    "isdst": false,
    "text": "(UTC-03:00) Brasilia",
    "utc": [
      "America/Sao_Paulo"
    ]
  },
  {
    "windowsTimeZone": "Argentina Standard Time",
    "ianaTimeZone": "America/Buenos_Aires",
    "abbr": "AST",
    "offset": -3.0,
    "isdst": false,
    "text": "(UTC-03:00) Buenos Aires",
    "utc": [
      "America/Argentina/La_Rioja",
      "America/Argentina/Rio_Gallegos",
      "America/Argentina/Salta",
      "America/Argentina/San_Juan",
      "America/Argentina/San_Luis",
      "America/Argentina/Tucuman",
      "America/Argentina/Ushuaia",
      "America/Buenos_Aires",
      "America/Catamarca",
      "America/Cordoba",
      "America/Jujuy",
      "America/Mendoza"
    ]
  },
  {
    "windowsTimeZone": "SA Eastern Standard Time",
    "ianaTimeZone": "America/Cayenne",
    "abbr": "SEST",
    "offset": -3.0,
    "isdst": false,
    "text": "(UTC-03:00) Cayenne, Fortaleza",
    "utc": [
      "America/Araguaina",
      "America/Belem",
      "America/Cayenne",
      "America/Fortaleza",
      "America/Maceio",
      "America/Paramaribo",
      "America/Recife",
      "America/Santarem",
      "Antarctica/Rothera",
      "Atlantic/Stanley",
      "Etc/GMT+3"
    ]
  },
  {
    "windowsTimeZone": "Greenland Standard Time",
    "ianaTimeZone": "America/Godthab",
    "abbr": "GDT",
    "offset": -2.0,
    "isdst": true,
    "text": "(UTC-03:00) Greenland",
    "utc": [
      "America/Godthab"
    ]
  },
  {
    "windowsTimeZone": "Montevideo Standard Time",
    "ianaTimeZone": "America/Montevideo",
    "abbr": "MST",
    "offset": -3.0,
    "isdst": false,
    "text": "(UTC-03:00) Montevideo",
    "utc": [
      "America/Montevideo"
    ]
  },
  {
    "windowsTimeZone": "Bahia Standard Time",
    "ianaTimeZone": "America/Bahia",
    "abbr": "BST",
    "offset": -3.0,
    "isdst": false,
    "text": "(UTC-03:00) Salvador",
    "utc": [
      "America/Bahia"
    ]
  },
  {
    "windowsTimeZone": "UTC-02",
    "ianaTimeZone": "Etc/GMT+2",
    "abbr": "U",
    "offset": -2.0,
    "isdst": false,
    "text": "(UTC-02:00) Coordinated Universal Time-02",
    "utc": [
      "America/Noronha",
      "Atlantic/South_Georgia",
      "Etc/GMT+2"
    ]
  },
  {
    "windowsTimeZone": "Azores Standard Time",
    "ianaTimeZone": "Atlantic/Azores",
    "abbr": "ADT",
    "offset": 0.0,
    "isdst": true,
    "text": "(UTC-01:00) Azores",
    "utc": [
      "America/Scoresbysund",
      "Atlantic/Azores"
    ]
  },
  {
    "windowsTimeZone": "Cape Verde Standard Time",
    "ianaTimeZone": "Atlantic/Cape_Verde",
    "abbr": "CVST",
    "offset": -1.0,
    "isdst": false,
    "text": "(UTC-01:00) Cape Verde Is.",
    "utc": [
      "Atlantic/Cape_Verde",
      "Etc/GMT+1"
    ]
  },
  {
    "windowsTimeZone": "Morocco Standard Time",
    "ianaTimeZone": "Africa/Casablanca",
    "abbr": "MDT",
    "offset": 1.0,
    "isdst": true,
    "text": "(UTC) Casablanca",
    "utc": [
      "Africa/Casablanca",
      "Africa/El_Aaiun"
    ]
  },
  {
    "windowsTimeZone": "UTC",
    "ianaTimeZone": "Etc/GMT",
    "abbr": "CUT",
    "offset": 0.0,
    "isdst": false,
    "text": "(UTC) Coordinated Universal Time",
    "utc": [
      "America/Danmarkshavn",
      "Etc/GMT"
    ]
  },
  {
    "windowsTimeZone": "GMT Standard Time",
    "ianaTimeZone": "Europe/London",
    "abbr": "GDT",
    "offset": 1.0,
    "isdst": true,
    "text": "(UTC) Dublin, Edinburgh, Lisbon, London",
    "utc": [
      "Atlantic/Canary",
      "Atlantic/Faeroe",
      "Atlantic/Madeira",
      "Europe/Dublin",
      "Europe/Guernsey",
      "Europe/Isle_of_Man",
      "Europe/Jersey",
      "Europe/Lisbon",
      "Europe/London"
    ]
  },
  {
    "windowsTimeZone": "Greenwich Standard Time",
    "ianaTimeZone": "Atlantic/Reykjavik",
    "abbr": "GST",
    "offset": 0.0,
    "isdst": false,
    "text": "(UTC) Monrovia, Reykjavik",
    "utc": [
      "Africa/Abidjan",
      "Africa/Accra",
      "Africa/Bamako",
      "Africa/Banjul",
      "Africa/Bissau",
      "Africa/Conakry",
      "Africa/Dakar",
      "Africa/Freetown",
      "Africa/Lome",
      "Africa/Monrovia",
      "Africa/Nouakchott",
      "Africa/Ouagadougou",
      "Africa/Sao_Tome",
      "Atlantic/Reykjavik",
      "Atlantic/St_Helena"
    ]
  },
  {
    "windowsTimeZone": "W. Europe Standard Time",
    "ianaTimeZone": "Europe/Berlin",
    "abbr": "WEDT",
    "offset": 2.0,
    "isdst": true,
    "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    "utc": [
      "Arctic/Longyearbyen",
      "Europe/Amsterdam",
      "Europe/Andorra",
      "Europe/Berlin",
      "Europe/Busingen",
      "Europe/Gibraltar",
      "Europe/Luxembourg",
      "Europe/Malta",
      "Europe/Monaco",
      "Europe/Oslo",
      "Europe/Rome",
      "Europe/San_Marino",
      "Europe/Stockholm",
      "Europe/Vaduz",
      "Europe/Vatican",
      "Europe/Vienna",
      "Europe/Zurich"
    ]
  },
  {
    "windowsTimeZone": "Central Europe Standard Time",
    "ianaTimeZone": "Europe/Budapest",
    "abbr": "CEDT",
    "offset": 2.0,
    "isdst": true,
    "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    "utc": [
      "Europe/Belgrade",
      "Europe/Bratislava",
      "Europe/Budapest",
      "Europe/Ljubljana",
      "Europe/Podgorica",
      "Europe/Prague",
      "Europe/Tirane"
    ]
  },
  {
    "windowsTimeZone": "Romance Standard Time",
    "ianaTimeZone": "Europe/Paris",
    "abbr": "RDT",
    "offset": 2.0,
    "isdst": true,
    "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
    "utc": [
      "Africa/Ceuta",
      "Europe/Brussels",
      "Europe/Copenhagen",
      "Europe/Madrid",
      "Europe/Paris"
    ]
  },
  {
    "windowsTimeZone": "Central European Standard Time",
    "ianaTimeZone": "Europe/Warsaw",
    "abbr": "CEDT",
    "offset": 2.0,
    "isdst": true,
    "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
    "utc": [
      "Europe/Sarajevo",
      "Europe/Skopje",
      "Europe/Warsaw",
      "Europe/Zagreb"
    ]
  },
  {
    "windowsTimeZone": "W. Central Africa Standard Time",
    "ianaTimeZone": "Africa/Lagos",
    "abbr": "WCAST",
    "offset": 1.0,
    "isdst": false,
    "text": "(UTC+01:00) West Central Africa",
    "utc": [
      "Africa/Algiers",
      "Africa/Bangui",
      "Africa/Brazzaville",
      "Africa/Douala",
      "Africa/Kinshasa",
      "Africa/Lagos",
      "Africa/Libreville",
      "Africa/Luanda",
      "Africa/Malabo",
      "Africa/Ndjamena",
      "Africa/Niamey",
      "Africa/Porto-Novo",
      "Africa/Tunis",
      "Etc/GMT-1"
    ]
  },
  {
    "windowsTimeZone": "Namibia Standard Time",
    "ianaTimeZone": "Africa/Windhoek",
    "abbr": "NST",
    "offset": 1.0,
    "isdst": false,
    "text": "(UTC+01:00) Windhoek",
    "utc": [
      "Africa/Windhoek"
    ]
  },
  {
    "windowsTimeZone": "GTB Standard Time",
    "ianaTimeZone": "Europe/Bucharest",
    "abbr": "GDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) Athens, Bucharest",
    "utc": [
      "Asia/Nicosia",
      "Europe/Athens",
      "Europe/Bucharest",
      "Europe/Chisinau"
    ]
  },
  {
    "windowsTimeZone": "Middle East Standard Time",
    "ianaTimeZone": "Asia/Beirut",
    "abbr": "MEDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) Beirut",
    "utc": [
      "Asia/Beirut"
    ]
  },
  {
    "windowsTimeZone": "Egypt Standard Time",
    "ianaTimeZone": "Africa/Cairo",
    "abbr": "EST",
    "offset": 2.0,
    "isdst": false,
    "text": "(UTC+02:00) Cairo",
    "utc": [
      "Africa/Cairo"
    ]
  },
  {
    "windowsTimeZone": "Syria Standard Time",
    "ianaTimeZone": "Asia/Damascus",
    "abbr": "SDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) Damascus",
    "utc": [
      "Asia/Damascus"
    ]
  },
  {
    "windowsTimeZone": "E. Europe Standard Time",
    "ianaTimeZone": "Europe/Chisinau",
    "abbr": "EEDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) E. Europe",
    "utc": null
  },
  {
    "windowsTimeZone": "South Africa Standard Time",
    "ianaTimeZone": "Africa/Johannesburg",
    "abbr": "SAST",
    "offset": 2.0,
    "isdst": false,
    "text": "(UTC+02:00) Harare, Pretoria",
    "utc": [
      "Africa/Blantyre",
      "Africa/Bujumbura",
      "Africa/Gaborone",
      "Africa/Harare",
      "Africa/Johannesburg",
      "Africa/Kigali",
      "Africa/Lubumbashi",
      "Africa/Lusaka",
      "Africa/Maputo",
      "Africa/Maseru",
      "Africa/Mbabane",
      "Etc/GMT-2"
    ]
  },
  {
    "windowsTimeZone": "FLE Standard Time",
    "ianaTimeZone": "Europe/Kiev",
    "abbr": "FDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    "utc": [
      "Europe/Helsinki",
      "Europe/Kiev",
      "Europe/Mariehamn",
      "Europe/Riga",
      "Europe/Sofia",
      "Europe/Tallinn",
      "Europe/Uzhgorod",
      "Europe/Vilnius",
      "Europe/Zaporozhye"
    ]
  },
  {
    "windowsTimeZone": "Turkey Standard Time",
    "ianaTimeZone": "Europe/Istanbul",
    "abbr": "TDT",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Istanbul",
    "utc": [
      "Europe/Istanbul"
    ]
  },
  {
    "windowsTimeZone": "Israel Standard Time",
    "ianaTimeZone": "Asia/Jerusalem",
    "abbr": "JDT",
    "offset": 3.0,
    "isdst": true,
    "text": "(UTC+02:00) Jerusalem",
    "utc": [
      "Asia/Jerusalem"
    ]
  },
  {
    "windowsTimeZone": "Libya Standard Time",
    "ianaTimeZone": "Africa/Tripoli",
    "abbr": "LST",
    "offset": 2.0,
    "isdst": false,
    "text": "(UTC+02:00) Tripoli",
    "utc": [
      "Africa/Tripoli"
    ]
  },
  {
    "windowsTimeZone": "Jordan Standard Time",
    "ianaTimeZone": "Asia/Amman",
    "abbr": "JST",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Amman",
    "utc": [
      "Asia/Amman"
    ]
  },
  {
    "windowsTimeZone": "Arabic Standard Time",
    "ianaTimeZone": "Asia/Baghdad",
    "abbr": "AST",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Baghdad",
    "utc": [
      "Asia/Baghdad"
    ]
  },
  {
    "windowsTimeZone": "Kaliningrad Standard Time",
    "ianaTimeZone": "Europe/Kaliningrad",
    "abbr": "KST",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Kaliningrad, Minsk",
    "utc": [
      "Europe/Kaliningrad",
      "Europe/Minsk"
    ]
  },
  {
    "windowsTimeZone": "Arab Standard Time",
    "ianaTimeZone": "Asia/Riyadh",
    "abbr": "AST",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Kuwait, Riyadh",
    "utc": [
      "Asia/Aden",
      "Asia/Bahrain",
      "Asia/Kuwait",
      "Asia/Qatar",
      "Asia/Riyadh"
    ]
  },
  {
    "windowsTimeZone": "E. Africa Standard Time",
    "ianaTimeZone": "Africa/Nairobi",
    "abbr": "EAST",
    "offset": 3.0,
    "isdst": false,
    "text": "(UTC+03:00) Nairobi",
    "utc": [
      "Africa/Addis_Ababa",
      "Africa/Asmera",
      "Africa/Dar_es_Salaam",
      "Africa/Djibouti",
      "Africa/Juba",
      "Africa/Kampala",
      "Africa/Khartoum",
      "Africa/Mogadishu",
      "Africa/Nairobi",
      "Antarctica/Syowa",
      "Etc/GMT-3",
      "Indian/Antananarivo",
      "Indian/Comoro",
      "Indian/Mayotte"
    ]
  },
  {
    "windowsTimeZone": "Iran Standard Time",
    "ianaTimeZone": "Asia/Tehran",
    "abbr": "IDT",
    "offset": 4.5,
    "isdst": true,
    "text": "(UTC+03:30) Tehran",
    "utc": [
      "Asia/Tehran"
    ]
  },
  {
    "windowsTimeZone": "Arabian Standard Time",
    "ianaTimeZone": "Asia/Dubai",
    "abbr": "AST",
    "offset": 4.0,
    "isdst": false,
    "text": "(UTC+04:00) Abu Dhabi, Muscat",
    "utc": [
      "Asia/Dubai",
      "Asia/Muscat",
      "Etc/GMT-4"
    ]
  },
  {
    "windowsTimeZone": "Azerbaijan Standard Time",
    "ianaTimeZone": "Asia/Baku",
    "abbr": "ADT",
    "offset": 5.0,
    "isdst": true,
    "text": "(UTC+04:00) Baku",
    "utc": [
      "Asia/Baku"
    ]
  },
  {
    "windowsTimeZone": "Russian Standard Time",
    "ianaTimeZone": "Europe/Moscow",
    "abbr": "RST",
    "offset": 4.0,
    "isdst": false,
    "text": "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
    "utc": [
      "Europe/Moscow",
      "Europe/Samara",
      "Europe/Simferopol",
      "Europe/Volgograd"
    ]
  },
  {
    "windowsTimeZone": "Mauritius Standard Time",
    "ianaTimeZone": "Indian/Mauritius",
    "abbr": "MST",
    "offset": 4.0,
    "isdst": false,
    "text": "(UTC+04:00) Port Louis",
    "utc": [
      "Indian/Mahe",
      "Indian/Mauritius",
      "Indian/Reunion"
    ]
  },
  {
    "windowsTimeZone": "Georgian Standard Time",
    "ianaTimeZone": "Asia/Tbilisi",
    "abbr": "GST",
    "offset": 4.0,
    "isdst": false,
    "text": "(UTC+04:00) Tbilisi",
    "utc": [
      "Asia/Tbilisi"
    ]
  },
  {
    "windowsTimeZone": "Caucasus Standard Time",
    "ianaTimeZone": "Asia/Yerevan",
    "abbr": "CST",
    "offset": 4.0,
    "isdst": false,
    "text": "(UTC+04:00) Yerevan",
    "utc": [
      "Asia/Yerevan"
    ]
  },
  {
    "windowsTimeZone": "Afghanistan Standard Time",
    "ianaTimeZone": "Asia/Kabul",
    "abbr": "AST",
    "offset": 4.5,
    "isdst": false,
    "text": "(UTC+04:30) Kabul",
    "utc": [
      "Asia/Kabul"
    ]
  },
  {
    "windowsTimeZone": "West Asia Standard Time",
    "ianaTimeZone": "Asia/Tashkent",
    "abbr": "WAST",
    "offset": 5.0,
    "isdst": false,
    "text": "(UTC+05:00) Ashgabat, Tashkent",
    "utc": [
      "Antarctica/Mawson",
      "Asia/Aqtau",
      "Asia/Aqtobe",
      "Asia/Ashgabat",
      "Asia/Dushanbe",
      "Asia/Oral",
      "Asia/Samarkand",
      "Asia/Tashkent",
      "Etc/GMT-5",
      "Indian/Kerguelen",
      "Indian/Maldives"
    ]
  },
  {
    "windowsTimeZone": "Pakistan Standard Time",
    "ianaTimeZone": "Asia/Karachi",
    "abbr": "PST",
    "offset": 5.0,
    "isdst": false,
    "text": "(UTC+05:00) Islamabad, Karachi",
    "utc": [
      "Asia/Karachi"
    ]
  },
  {
    "windowsTimeZone": "India Standard Time",
    "ianaTimeZone": "Asia/Calcutta",
    "abbr": "IST",
    "offset": 5.5,
    "isdst": false,
    "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    "utc": [
      "Asia/Kolkata"
    ]
  },
  {
    "windowsTimeZone": "Sri Lanka Standard Time",
    "ianaTimeZone": "Asia/Colombo",
    "abbr": "SLST",
    "offset": 5.5,
    "isdst": false,
    "text": "(UTC+05:30) Sri Jayawardenepura",
    "utc": [
      "Asia/Colombo"
    ]
  },
  {
    "windowsTimeZone": "Nepal Standard Time",
    "ianaTimeZone": "Asia/Katmandu",
    "abbr": "NST",
    "offset": 5.75,
    "isdst": false,
    "text": "(UTC+05:45) Kathmandu",
    "utc": [
      "Asia/Katmandu"
    ]
  },
  {
    "windowsTimeZone": "Central Asia Standard Time",
    "ianaTimeZone": "Asia/Almaty",
    "abbr": "CAST",
    "offset": 6.0,
    "isdst": false,
    "text": "(UTC+06:00) Astana",
    "utc": [
      "Antarctica/Vostok",
      "Asia/Almaty",
      "Asia/Bishkek",
      "Asia/Qyzylorda",
      "Asia/Urumqi",
      "Etc/GMT-6",
      "Indian/Chagos"
    ]
  },
  {
    "windowsTimeZone": "Bangladesh Standard Time",
    "ianaTimeZone": "Asia/Dhaka",
    "abbr": "BST",
    "offset": 6.0,
    "isdst": false,
    "text": "(UTC+06:00) Dhaka",
    "utc": [
      "Asia/Dhaka",
      "Asia/Thimphu"
    ]
  },
  {
    "windowsTimeZone": "Ekaterinburg Standard Time",
    "ianaTimeZone": "Asia/Yekaterinburg",
    "abbr": "EST",
    "offset": 6.0,
    "isdst": false,
    "text": "(UTC+06:00) Ekaterinburg",
    "utc": [
      "Asia/Yekaterinburg"
    ]
  },
  {
    "windowsTimeZone": "Myanmar Standard Time",
    "ianaTimeZone": "Asia/Rangoon",
    "abbr": "MST",
    "offset": 6.5,
    "isdst": false,
    "text": "(UTC+06:30) Yangon (Rangoon)",
    "utc": [
      "Asia/Rangoon",
      "Indian/Cocos"
    ]
  },
  {
    "windowsTimeZone": "SE Asia Standard Time",
    "ianaTimeZone": "Asia/Bangkok",
    "abbr": "SAST",
    "offset": 7.0,
    "isdst": false,
    "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    "utc": [
      "Antarctica/Davis",
      "Asia/Bangkok",
      "Asia/Hovd",
      "Asia/Jakarta",
      "Asia/Phnom_Penh",
      "Asia/Pontianak",
      "Asia/Saigon",
      "Asia/Vientiane",
      "Etc/GMT-7",
      "Indian/Christmas"
    ]
  },
  {
    "windowsTimeZone": "N. Central Asia Standard Time",
    "ianaTimeZone": "Asia/Novosibirsk",
    "abbr": "NCAST",
    "offset": 7.0,
    "isdst": false,
    "text": "(UTC+07:00) Novosibirsk",
    "utc": [
      "Asia/Novokuznetsk",
      "Asia/Novosibirsk",
      "Asia/Omsk"
    ]
  },
  {
    "windowsTimeZone": "China Standard Time",
    "ianaTimeZone": "Asia/Shanghai",
    "abbr": "CST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    "utc": [
      "Asia/Hong_Kong",
      "Asia/Macau",
      "Asia/Shanghai"
    ]
  },
  {
    "windowsTimeZone": "North Asia Standard Time",
    "ianaTimeZone": "Asia/Krasnoyarsk",
    "abbr": "NAST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Krasnoyarsk",
    "utc": [
      "Asia/Krasnoyarsk"
    ]
  },
  {
    "windowsTimeZone": "Singapore Standard Time",
    "ianaTimeZone": "Asia/Singapore",
    "abbr": "MPST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Kuala Lumpur, Singapore",
    "utc": [
      "Asia/Brunei",
      "Asia/Kuala_Lumpur",
      "Asia/Kuching",
      "Asia/Makassar",
      "Asia/Manila",
      "Asia/Singapore",
      "Etc/GMT-8"
    ]
  },
  {
    "windowsTimeZone": "W. Australia Standard Time",
    "ianaTimeZone": "Australia/Perth",
    "abbr": "WAST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Perth",
    "utc": [
      "Antarctica/Casey",
      "Australia/Perth"
    ]
  },
  {
    "windowsTimeZone": "Taipei Standard Time",
    "ianaTimeZone": "Asia/Taipei",
    "abbr": "TST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Taipei",
    "utc": [
      "Asia/Taipei"
    ]
  },
  {
    "windowsTimeZone": "Ulaanbaatar Standard Time",
    "ianaTimeZone": "Asia/Ulaanbaatar",
    "abbr": "UST",
    "offset": 8.0,
    "isdst": false,
    "text": "(UTC+08:00) Ulaanbaatar",
    "utc": [
      "Asia/Choibalsan",
      "Asia/Ulaanbaatar"
    ]
  },
  {
    "windowsTimeZone": "North Asia East Standard Time",
    "ianaTimeZone": "Asia/Irkutsk",
    "abbr": "NAEST",
    "offset": 9.0,
    "isdst": false,
    "text": "(UTC+09:00) Irkutsk",
    "utc": [
      "Asia/Irkutsk"
    ]
  },
  {
    "windowsTimeZone": "Tokyo Standard Time",
    "ianaTimeZone": "Asia/Tokyo",
    "abbr": "TST",
    "offset": 9.0,
    "isdst": false,
    "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
    "utc": [
      "Asia/Dili",
      "Asia/Jayapura",
      "Asia/Tokyo",
      "Etc/GMT-9",
      "Pacific/Palau"
    ]
  },
  {
    "windowsTimeZone": "Korea Standard Time",
    "ianaTimeZone": "Asia/Seoul",
    "abbr": "KST",
    "offset": 9.0,
    "isdst": false,
    "text": "(UTC+09:00) Seoul",
    "utc": [
      "Asia/Pyongyang",
      "Asia/Seoul"
    ]
  },
  {
    "windowsTimeZone": "Cen. Australia Standard Time",
    "ianaTimeZone": "Australia/Adelaide",
    "abbr": "CAST",
    "offset": 9.5,
    "isdst": false,
    "text": "(UTC+09:30) Adelaide",
    "utc": [
      "Australia/Adelaide",
      "Australia/Broken_Hill"
    ]
  },
  {
    "windowsTimeZone": "AUS Central Standard Time",
    "ianaTimeZone": "Australia/Darwin",
    "abbr": "ACST",
    "offset": 9.5,
    "isdst": false,
    "text": "(UTC+09:30) Darwin",
    "utc": [
      "Australia/Darwin"
    ]
  },
  {
    "windowsTimeZone": "E. Australia Standard Time",
    "ianaTimeZone": "Australia/Brisbane",
    "abbr": "EAST",
    "offset": 10.0,
    "isdst": false,
    "text": "(UTC+10:00) Brisbane",
    "utc": [
      "Australia/Brisbane",
      "Australia/Lindeman"
    ]
  },
  {
    "windowsTimeZone": "AUS Eastern Standard Time",
    "ianaTimeZone": "Australia/Sydney",
    "abbr": "AEST",
    "offset": 10.0,
    "isdst": false,
    "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
    "utc": [
      "Australia/Melbourne",
      "Australia/Sydney"
    ]
  },
  {
    "windowsTimeZone": "West Pacific Standard Time",
    "ianaTimeZone": "Pacific/Port_Moresby",
    "abbr": "WPST",
    "offset": 10.0,
    "isdst": false,
    "text": "(UTC+10:00) Guam, Port Moresby",
    "utc": [
      "Antarctica/DumontDUrville",
      "Etc/GMT-10",
      "Pacific/Guam",
      "Pacific/Port_Moresby",
      "Pacific/Saipan",
      "Pacific/Truk"
    ]
  },
  {
    "windowsTimeZone": "Tasmania Standard Time",
    "ianaTimeZone": "Australia/Hobart",
    "abbr": "TST",
    "offset": 10.0,
    "isdst": false,
    "text": "(UTC+10:00) Hobart",
    "utc": [
      "Australia/Currie",
      "Australia/Hobart"
    ]
  },
  {
    "windowsTimeZone": "Yakutsk Standard Time",
    "ianaTimeZone": "Asia/Yakutsk",
    "abbr": "YST",
    "offset": 10.0,
    "isdst": false,
    "text": "(UTC+10:00) Yakutsk",
    "utc": [
      "Asia/Chita",
      "Asia/Khandyga",
      "Asia/Yakutsk"
    ]
  },
  {
    "windowsTimeZone": "Central Pacific Standard Time",
    "ianaTimeZone": "Pacific/Guadalcanal",
    "abbr": "CPST",
    "offset": 11.0,
    "isdst": false,
    "text": "(UTC+11:00) Solomon Is., New Caledonia",
    "utc": [
      "Antarctica/Macquarie",
      "Etc/GMT-11",
      "Pacific/Efate",
      "Pacific/Guadalcanal",
      "Pacific/Kosrae",
      "Pacific/Noumea",
      "Pacific/Ponape"
    ]
  },
  {
    "windowsTimeZone": "Vladivostok Standard Time",
    "ianaTimeZone": "Asia/Vladivostok",
    "abbr": "VST",
    "offset": 11.0,
    "isdst": false,
    "text": "(UTC+11:00) Vladivostok",
    "utc": [
      "Asia/Sakhalin",
      "Asia/Ust-Nera",
      "Asia/Vladivostok"
    ]
  },
  {
    "windowsTimeZone": "New Zealand Standard Time",
    "ianaTimeZone": "Pacific/Auckland",
    "abbr": "NZST",
    "offset": 12.0,
    "isdst": false,
    "text": "(UTC+12:00) Auckland, Wellington",
    "utc": [
      "Antarctica/McMurdo",
      "Pacific/Auckland"
    ]
  },
  {
    "windowsTimeZone": "UTC+12",
    "ianaTimeZone": "Etc/GMT-12",
    "abbr": "U",
    "offset": 12.0,
    "isdst": false,
    "text": "(UTC+12:00) Coordinated Universal Time+12",
    "utc": [
      "Etc/GMT-12",
      "Pacific/Funafuti",
      "Pacific/Kwajalein",
      "Pacific/Majuro",
      "Pacific/Nauru",
      "Pacific/Tarawa",
      "Pacific/Wake",
      "Pacific/Wallis"
    ]
  },
  {
    "windowsTimeZone": "Fiji Standard Time",
    "ianaTimeZone": "Pacific/Fiji",
    "abbr": "FST",
    "offset": 12.0,
    "isdst": false,
    "text": "(UTC+12:00) Fiji",
    "utc": [
      "Pacific/Fiji"
    ]
  },
  {
    "windowsTimeZone": "Magadan Standard Time",
    "ianaTimeZone": "Asia/Magadan",
    "abbr": "MST",
    "offset": 12.0,
    "isdst": false,
    "text": "(UTC+12:00) Magadan",
    "utc": [
      "Asia/Anadyr",
      "Asia/Kamchatka",
      "Asia/Magadan",
      "Asia/Srednekolymsk"
    ]
  },
  {
    "windowsTimeZone": "Kamchatka Standard Time",
    "ianaTimeZone": "Asia/Kamchatka",
    "abbr": "KDT",
    "offset": 13.0,
    "isdst": true,
    "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
    "utc": null
  },
  {
    "windowsTimeZone": "Tonga Standard Time",
    "ianaTimeZone": "Pacific/Tongatapu",
    "abbr": "TST",
    "offset": 13.0,
    "isdst": false,
    "text": "(UTC+13:00) Nuku'alofa",
    "utc": [
      "Etc/GMT-13",
      "Pacific/Enderbury",
      "Pacific/Fakaofo",
      "Pacific/Tongatapu"
    ]
  },
  {
    "windowsTimeZone": "Samoa Standard Time",
    "ianaTimeZone": "Pacific/Apia",
    "abbr": "SST",
    "offset": 13.0,
    "isdst": false,
    "text": "(UTC+13:00) Samoa",
    "utc": [
      "Pacific/Apia"
    ]
  }
];

