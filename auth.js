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

    static register(username, password) {
        const users = this.getUsers();
        if (users[username]) {
            throw new Error('Username already exists');
        }
        users[username] = {
            password,
            chats: []
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
}
