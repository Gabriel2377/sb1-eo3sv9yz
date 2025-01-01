new Vue({
    el: '#app',
    data: {
        currentView: 'user-onboarding',
        currentUser: null,
        posts: []
    },
    async created() {
        const user = await DatabaseService.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.currentView = 'feed-view';
            this.loadPosts();
        }
    },
    methods: {
        switchView(view) {
            this.currentView = view;
        },
        async loadPosts() {
            this.posts = await DatabaseService.getPosts();
        },
        async createPost(postData) {
            await DatabaseService.addPost({
                ...postData,
                userId: this.currentUser.id
            });
            await this.loadPosts();
        },
        async likePost(postId) {
            // Handle liking posts
        }
    }
});