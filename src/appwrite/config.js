import env from "../config/env";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(env.appwriteUrl)
            .setProject(env.appwriteProjectId);

        this.databases = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createRow({
                databaseId: env.appwriteDatabaseId,
                tableId: env.appwriteCollectionId,
                rowId: slug,
                data: { title, content, featuredImage, status, userId },
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateRow(
                env.appwriteDatabaseId,
                env.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                },
            );
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteRow({
                databaseId: env.appwriteDatabaseId,
                tableId: env.appwriteCollectionId,
                rowId: slug,
            });

            return true;
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getRow({
                databaseId: env.appwriteDatabaseId,
                tableId: env.appwriteCollectionId,
                rowId: slug,
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listRows({
                databaseId: env.appwriteDatabaseId,
                tableId: env.appwriteCollectionId,
                queries,
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }

    // file upload services

    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: env.appwriteBucketId,
                fileId: ID.unique(),
                file: file,
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: env.appwriteBucketId,
                fileId,
            });

            return true;
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }

    getFilePreview(fileId) {
        try {
            return this.storage.getFilePreview({
                bucketId: env.appwriteBucketId,
                fileId,
            });
        } catch (err) {
            console.error(`Appwrite service error: ${err}`);
            return false;
        }
    }
}

const service = new Service();
export default service;
