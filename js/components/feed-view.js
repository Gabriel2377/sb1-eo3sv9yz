Vue.component('feed-view', {
    template: `
        <div class="feed-container">
            <div v-for="post in posts" 
                 :key="post.id" 
                 class="post"
                 :style="{ backgroundImage: 'url(' + post.backgroundUrl + ')' }">
                <div class="post-overlay" v-html="post.content"></div>
            </div>
            <div class="bottom-actions">
                <button class="fab" @click="$emit('switch-view', 'create-post')">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="fab" @click="showListModal = true">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            
            <!-- Save to List Modal -->
            <div v-if="showListModal" class="modal" @click.self="showListModal = false">
                <div class="modal-content">
                    <h3>Save to List</h3>
                    <div v-for="list in lists" :key="list.id">
                        <button @click="saveToList(list.id)">{{ list.name }}</button>
                    </div>
                    <input v-model="newListName" placeholder="New list name">
                    <button @click="createNewList">Create New List</button>
                </div>
            </div>
        </div>
    `,
    props: ['posts', 'user'],
    data() {
        return {
            showListModal: false,
            lists: [],
            newListName: ''
        };
    },
    async created() {
        this.lists = await DatabaseService.getLists(this.user.id);
    },
    methods: {
        async createNewList() {
            if (!this.newListName) return;
            await DatabaseService.createList(this.user.id, this.newListName);
            this.lists = await DatabaseService.getLists(this.user.id);
            this.newListName = '';
        },
        async saveToList(listId) {
            await DatabaseService.savePostToList(
                this.currentPost.id,
                listId,
                this.user.id
            );
            this.showListModal = false;
        }
    }
});