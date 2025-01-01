Vue.component('create-post', {
    template: `
        <div class="editor-container">
            <div class="editor-content" :style="{ backgroundImage: backgroundUrl ? 'url(' + backgroundUrl + ')' : 'none' }">
                <div class="post-overlay">
                    <div id="editor"></div>
                </div>
            </div>
            
            <div class="editor-toolbar">
                <div class="fab-menu">
                    <button class="fab" @click="showFormatting = !showFormatting">
                        <i class="fas fa-font"></i>
                    </button>
                    <div v-if="showFormatting" class="format-options">
                        <button @click="format('bold')"><i class="fas fa-bold"></i></button>
                        <button @click="format('italic')"><i class="fas fa-italic"></i></button>
                        <button @click="format('underline')"><i class="fas fa-underline"></i></button>
                    </div>
                </div>
                
                <div class="fab-menu">
                    <button class="fab" @click="showAlignment = !showAlignment">
                        <i class="fas fa-align-left"></i>
                    </button>
                    <div v-if="showAlignment" class="format-options">
                        <button @click="align('left')"><i class="fas fa-align-left"></i></button>
                        <button @click="align('center')"><i class="fas fa-align-center"></i></button>
                        <button @click="align('right')"><i class="fas fa-align-right"></i></button>
                        <button @click="align('justify')"><i class="fas fa-align-justify"></i></button>
                    </div>
                </div>
                
                <button class="fab" @click="showBackgroundModal = true">
                    <i class="fas fa-image"></i>
                </button>
                
                <button class="fab" @click="showColorPicker = true">
                    <i class="fas fa-palette"></i>
                </button>
                
                <button class="fab" @click="showFontPicker = true">
                    <i class="fas fa-text-height"></i>
                </button>
            </div>

            <!-- Background URL Modal -->
            <div v-if="showBackgroundModal" class="modal" @click.self="showBackgroundModal = false">
                <div class="modal-content">
                    <h3>Set Background Image</h3>
                    <input v-model="backgroundUrl" 
                           type="text" 
                           placeholder="Enter image URL">
                    <button @click="setBackground">Set Background</button>
                    <button @click="showBackgroundModal = false">Cancel</button>
                </div>
            </div>

            <!-- Color Picker Modal -->
            <color-picker v-if="showColorPicker"
                         @close="showColorPicker = false"
                         @color-selected="setColor">
            </color-picker>

            <!-- Font Picker Modal -->
            <font-picker v-if="showFontPicker"
                        @close="showFontPicker = false"
                        @font-selected="setFont">
            </font-picker>

            <button class="fab" 
                    style="position: fixed; bottom: 20px; right: 20px;"
                    @click="savePost">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `,
    props: ['user'],
    data() {
        return {
            editor: null,
            backgroundUrl: '',
            showBackgroundModal: false,
            showColorPicker: false,
            showFontPicker: false,
            showFormatting: false,
            showAlignment: false
        };
    },
    mounted() {
        // Initialize Quill with specific modules and formats
        this.editor = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: false
            },
            formats: ['bold', 'italic', 'underline', 'align', 'color', 'font']
        });

        // Set default styles
        this.editor.root.style.color = 'white';
        this.editor.root.style.fontSize = '18px';
        
        // Add click handler to close format menus when clicking outside
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        handleClickOutside(event) {
            if (!event.target.closest('.fab-menu')) {
                this.showFormatting = false;
                this.showAlignment = false;
            }
        },
        format(command) {
            const selection = this.editor.getSelection();
            if (selection) {
                const currentFormat = this.editor.getFormat(selection);
                this.editor.format(command, !currentFormat[command]);
            }
        },
        align(alignment) {
            const selection = this.editor.getSelection();
            if (selection) {
                this.editor.format('align', alignment);
            }
        },
        setBackground() {
            this.showBackgroundModal = false;
        },
        setColor(color) {
            const selection = this.editor.getSelection();
            if (selection) {
                this.editor.format('color', color);
            }
        },
        setFont(font) {
            const selection = this.editor.getSelection();
            if (selection) {
                this.editor.format('font', font);
            }
        },
        async savePost() {
            const content = this.editor.root.innerHTML;
            await DatabaseService.addPost({
                content,
                backgroundUrl: this.backgroundUrl,
                userId: this.user.id,
                createdAt: Date.now()
            });
            this.$emit('switch-view', 'feed-view');
        }
    }
});