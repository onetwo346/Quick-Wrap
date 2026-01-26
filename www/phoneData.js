// Phone number data with countries and area codes
const PhoneData = {
    countries: {
        US: {
            name: 'United States',
            code: '+1',
            flag: '🇺🇸',
            areaCodes: {
                '212': 'New York, NY',
                '213': 'Los Angeles, CA',
                '310': 'Los Angeles, CA',
                '312': 'Chicago, IL',
                '305': 'Miami, FL',
                '404': 'Atlanta, GA',
                '415': 'San Francisco, CA',
                '469': 'Dallas, TX',
                '602': 'Phoenix, AZ',
                '206': 'Seattle, WA',
                '303': 'Denver, CO',
                '617': 'Boston, MA',
                '702': 'Las Vegas, NV',
                '713': 'Houston, TX',
                '818': 'Los Angeles, CA',
                '202': 'Washington, DC',
                '718': 'New York, NY',
                '347': 'New York, NY',
                '917': 'New York, NY',
                '323': 'Los Angeles, CA'
            }
        },
        UK: {
            name: 'United Kingdom',
            code: '+44',
            flag: '🇬🇧',
            areaCodes: {
                '20': 'London',
                '121': 'Birmingham',
                '161': 'Manchester',
                '141': 'Glasgow',
                '113': 'Leeds',
                '117': 'Bristol',
                '131': 'Edinburgh',
                '151': 'Liverpool',
                '191': 'Newcastle',
                '114': 'Sheffield'
            }
        },
        CA: {
            name: 'Canada',
            code: '+1',
            flag: '🇨🇦',
            areaCodes: {
                '416': 'Toronto, ON',
                '647': 'Toronto, ON',
                '604': 'Vancouver, BC',
                '778': 'Vancouver, BC',
                '514': 'Montreal, QC',
                '438': 'Montreal, QC',
                '403': 'Calgary, AB',
                '780': 'Edmonton, AB',
                '613': 'Ottawa, ON',
                '902': 'Halifax, NS'
            }
        },
        AU: {
            name: 'Australia',
            code: '+61',
            flag: '🇦🇺',
            areaCodes: {
                '2': 'Sydney, NSW',
                '3': 'Melbourne, VIC',
                '7': 'Brisbane, QLD',
                '8': 'Perth, WA',
                '4': 'Mobile'
            }
        },
        DE: {
            name: 'Germany',
            code: '+49',
            flag: '🇩🇪',
            areaCodes: {
                '30': 'Berlin',
                '89': 'Munich',
                '40': 'Hamburg',
                '69': 'Frankfurt',
                '221': 'Cologne',
                '211': 'Düsseldorf',
                '711': 'Stuttgart',
                '351': 'Dresden'
            }
        },
        FR: {
            name: 'France',
            code: '+33',
            flag: '🇫🇷',
            areaCodes: {
                '1': 'Paris',
                '4': 'Lyon/Marseille',
                '5': 'Bordeaux/Toulouse',
                '2': 'Nantes/Lille',
                '3': 'Strasbourg'
            }
        },
        IN: {
            name: 'India',
            code: '+91',
            flag: '🇮🇳',
            areaCodes: {
                '11': 'Delhi',
                '22': 'Mumbai',
                '33': 'Kolkata',
                '44': 'Chennai',
                '80': 'Bangalore',
                '40': 'Hyderabad',
                '79': 'Ahmedabad',
                '20': 'Pune'
            }
        },
        BR: {
            name: 'Brazil',
            code: '+55',
            flag: '🇧🇷',
            areaCodes: {
                '11': 'São Paulo',
                '21': 'Rio de Janeiro',
                '31': 'Belo Horizonte',
                '61': 'Brasília',
                '71': 'Salvador',
                '81': 'Recife',
                '51': 'Porto Alegre'
            }
        },
        MX: {
            name: 'Mexico',
            code: '+52',
            flag: '🇲🇽',
            areaCodes: {
                '55': 'Mexico City',
                '33': 'Guadalajara',
                '81': 'Monterrey',
                '664': 'Tijuana',
                '998': 'Cancún',
                '222': 'Puebla'
            }
        },
        JP: {
            name: 'Japan',
            code: '+81',
            flag: '🇯🇵',
            areaCodes: {
                '3': 'Tokyo',
                '6': 'Osaka',
                '52': 'Nagoya',
                '11': 'Sapporo',
                '92': 'Fukuoka',
                '75': 'Kyoto'
            }
        }
    },

    // Generate a unique 7-digit number (no dashes, just digits)
    generateNumber() {
        // Generate 7 digits
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    },

    // Format full phone number for display
    formatDisplayNumber(countryCode, areaCode, number) {
        // Format: +1 (718) 326-3316
        const formatted = number.slice(0, 3) + '-' + number.slice(3);
        return `${countryCode} (${areaCode}) ${formatted}`;
    },

    // Get the raw digits only (for peer ID and dialing)
    getRawNumber(countryCode, areaCode, number) {
        // Remove + from country code and concatenate: 17183263316
        return countryCode.replace('+', '') + areaCode + number;
    },

    // Normalize any input to raw digits
    normalizeToDigits(input) {
        return input.replace(/[^\d]/g, '');
    },

    // Get peer ID from raw digits
    digitsToPeerId(digits) {
        return 'qw-' + digits;
    },

    // Extract raw digits from peer ID
    peerIdToDigits(peerId) {
        if (peerId && peerId.startsWith('qw-')) {
            return peerId.substring(3);
        }
        return peerId;
    },

    // Format raw digits for display (best effort)
    formatForDisplay(rawDigits) {
        // Try to format nicely based on length
        if (rawDigits.length === 11 && rawDigits.startsWith('1')) {
            // US/Canada: 17183263316 -> +1 (718) 326-3316
            return `+1 (${rawDigits.slice(1, 4)}) ${rawDigits.slice(4, 7)}-${rawDigits.slice(7)}`;
        } else if (rawDigits.length === 10) {
            // Assume US without country code: 7183263316 -> (718) 326-3316
            return `(${rawDigits.slice(0, 3)}) ${rawDigits.slice(3, 6)}-${rawDigits.slice(6)}`;
        }
        // Default: just return as-is
        return rawDigits;
    }
};
