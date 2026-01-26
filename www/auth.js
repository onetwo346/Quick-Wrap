// Simple localStorage-based storage for demo purposes
// In a real app, you'd use a proper backend and database
class Auth {
    // Admin credentials
    static ADMIN_USERNAME = 'admin';
    static ADMIN_PASSWORD = 'admin123';

    static initAdmin() {
        const users = this.getUsers();
        if (!users[this.ADMIN_USERNAME]) {
            users[this.ADMIN_USERNAME] = {
                password: this.ADMIN_PASSWORD,
                isAdmin: true,
                chats: []
            };
            this.saveUsers(users);
        }
    }

    static isAdmin(username) {
        return username === this.ADMIN_USERNAME;
    }

    static getUsers() {
        const usersJson = localStorage.getItem('users') || '{}';
        return JSON.parse(usersJson);
    }

    static saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static register(username, password, country, areaCode) {
        const users = this.getUsers();
        if (users[username]) {
            throw new Error('Username already exists');
        }
        
        // Generate unique phone number
        const phoneData = this.generateUniquePhone(country, areaCode);
        
        users[username] = {
            password,
            phoneNumber: phoneData.display,      // For display: +1 (718) 326-3316
            phoneRaw: phoneData.raw,             // For dialing/peer ID: 17183263316
            country,
            areaCode,
            chats: []
        };
        this.saveUsers(users);
        return phoneData;
    }

    static generateUniquePhone(country, areaCode) {
        const users = this.getUsers();
        const countryData = PhoneData.countries[country];
        const countryCode = countryData.code;
        
        // Get all existing raw phone numbers
        const existingNumbers = Object.values(users)
            .map(u => u.phoneRaw)
            .filter(Boolean);
        
        let attempts = 0;
        let number, rawNumber;
        
        do {
            number = PhoneData.generateNumber();
            rawNumber = PhoneData.getRawNumber(countryCode, areaCode, number);
            attempts++;
        } while (existingNumbers.includes(rawNumber) && attempts < 100);
        
        return {
            display: PhoneData.formatDisplayNumber(countryCode, areaCode, number),
            raw: rawNumber
        };
    }

    // Find user by raw phone digits
    static getUserByRawPhone(rawDigits) {
        const users = this.getUsers();
        for (const [username, data] of Object.entries(users)) {
            if (data.phoneRaw === rawDigits) {
                return { username, ...data };
            }
        }
        return null;
    }

    // Find user by any phone format (normalizes input)
    static getUserByPhone(phoneInput) {
        const normalized = PhoneData.normalizeToDigits(phoneInput);
        return this.getUserByRawPhone(normalized);
    }

    static getCurrentUserData() {
        const username = this.getCurrentUser();
        if (!username) return null;
        const users = this.getUsers();
        return users[username] || null;
    }

    // Get current user's peer ID
    static getCurrentUserPeerId() {
        const userData = this.getCurrentUserData();
        if (!userData || !userData.phoneRaw) return null;
        return PhoneData.digitsToPeerId(userData.phoneRaw);
    }

    static login(username, password) {
        const users = this.getUsers();
        const user = users[username];
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }
        return true;
    }

    static getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    static setCurrentUser(username) {
        localStorage.setItem('currentUser', username);
    }

    static logout() {
        localStorage.removeItem('currentUser');
    }

    // Change user's phone number
    static changePhoneNumber(username, country, areaCode) {
        const users = this.getUsers();
        if (!users[username]) {
            return null;
        }
        
        // Generate new unique phone number
        const phoneData = this.generateUniquePhone(country, areaCode);
        
        // Update user data
        users[username].phoneNumber = phoneData.display;
        users[username].phoneRaw = phoneData.raw;
        users[username].country = country;
        users[username].areaCode = areaCode;
        
        this.saveUsers(users);
        return phoneData;
    }

    // Delete user account
    static deleteAccount(username) {
        const users = this.getUsers();
        if (users[username]) {
            delete users[username];
            this.saveUsers(users);
            return true;
        }
        return false;
    }
}