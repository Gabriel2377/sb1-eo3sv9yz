Vue.component('user-onboarding', {
    template: `
        <div class="modal">
            <div class="modal-content">
                <h2>Welcome!</h2>
                <p>Please enter your name to get started:</p>
                <input v-model="userName" 
                       @keyup.enter="createUser"
                       type="text" 
                       placeholder="Your name"
                       style="width: 100%; padding: 8px; margin: 10px 0;">
                <button @click="createUser" 
                        :disabled="!userName"
                        style="width: 100%; padding: 10px; background: var(--accent); border: none; color: white; border-radius: 4px;">
                    Get Started
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            userName: ''
        };
    },
    methods: {
        async createUser() {
            if (!this.userName) return;
            const user = await DatabaseService.initUser(this.userName);
            this.$emit('switch-view', 'feed-view');
        }
    }
});