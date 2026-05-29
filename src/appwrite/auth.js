import env from "../config/env";
import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(env.appwriteUrl)
            .setProject(env.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ name, email, password }) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name,
            });

            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession({
                email,
                password,
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (err) {
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession({
                sessionId: "current",
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
        }
    }
}

const authService = new AuthService();
export default authService;
