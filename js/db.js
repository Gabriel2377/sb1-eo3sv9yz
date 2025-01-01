const db = new Dexie('socialApp');

db.version(1).stores({
    users: '++id, name, createdAt',
    posts: '++id, userId, content, backgroundUrl, createdAt',
    lists: '++id, userId, name',
    savedPosts: '++id, postId, listId, userId'
});

const DatabaseService = {
    async initUser(name) {
        const userId = await db.users.add({
            name,
            createdAt: Date.now()
        });
        return db.users.get(userId);
    },

    async getCurrentUser() {
        const user = await db.users.toArray();
        return user[0] || null;
    },

    async addPost(post) {
        return db.posts.add(post);
    },

    async getPosts() {
        return db.posts.orderBy('createdAt').reverse().toArray();
    },

    async createList(userId, name) {
        return db.lists.add({ userId, name });
    },

    async getLists(userId) {
        return db.lists.where('userId').equals(userId).toArray();
    },

    async savePostToList(postId, listId, userId) {
        return db.savedPosts.add({ postId, listId, userId });
    }
};