// Simple localStorage-based storage for demo purposes
// In a real app, you'd use a proper backend and database
class Auth {
    static getUsers() {
        const usersJson = localStorage.getItem('users') || '{}';
        return JSON.parse(usersJson);
    }

    static saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    static register(username, password, email = '') {
        const users = this.getUsers();
        if (users[username]) {
            throw new Error('Username already exists');
        }
        users[username] = {
            password,
            email,
            chats: [],
            recoveryCode: email ? this.generateRecoveryCode() : null,
            recoveryCodeExpiry: email ? Date.now() + (24 * 60 * 60 * 1000) : null // 24 hours expiry
        };
        this.saveUsers(users);
        return true;
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
    
    static generateRecoveryCode() {
        // Generate a 6-digit recovery code
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    static requestPasswordReset(usernameOrEmail) {
        const users = this.getUsers();
        let foundUser = null;
        let foundUsername = null;
        
        // Check if it's a username
        if (users[usernameOrEmail]) {
            foundUser = users[usernameOrEmail];
            foundUsername = usernameOrEmail;
        } else {
            // Check if it's an email
            for (const username in users) {
                if (users[username].email === usernameOrEmail) {
                    foundUser = users[username];
                    foundUsername = username;
                    break;
                }
            }
        }
        
        if (!foundUser) {
            throw new Error('No account found with that username or email');
        }
        
        if (!foundUser.email) {
            throw new Error('No email associated with this account');
        }
        
        // Generate a new recovery code
        foundUser.recoveryCode = this.generateRecoveryCode();
        foundUser.recoveryCodeExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours expiry
        
        // Save the updated user data
        this.saveUsers(users);
        
        // In a real app, you would send an email here
        // For demo purposes, we'll just return the code and email
        return {
            email: foundUser.email,
            code: foundUser.recoveryCode,
            username: foundUsername
        };
    }
    
    static verifyRecoveryCode(username, code) {
        const users = this.getUsers();
        const user = users[username];
        
        if (!user) {
            throw new Error('User not found');
        }
        
        if (!user.recoveryCode) {
            throw new Error('No recovery code requested');
        }
        
        if (Date.now() > user.recoveryCodeExpiry) {
            throw new Error('Recovery code has expired');
        }
        
        if (user.recoveryCode !== code) {
            throw new Error('Invalid recovery code');
        }
        
        return true;
    }
    
    static resetPassword(username, code, newPassword) {
        if (this.verifyRecoveryCode(username, code)) {
            const users = this.getUsers();
            users[username].password = newPassword;
            users[username].recoveryCode = null;
            users[username].recoveryCodeExpiry = null;
            this.saveUsers(users);
            return true;
        }
        return false;
    }
    
    static getUserByEmail(email) {
        const users = this.getUsers();
        for (const username in users) {
            if (users[username].email === email) {
                return { username, ...users[username] };
            }
        }
        return null;
    }
}
