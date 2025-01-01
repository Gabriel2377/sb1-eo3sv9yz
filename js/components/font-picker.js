Vue.component('font-picker', {
    template: `
        <div class="modal" @click.self="$emit('close')">
            <div class="modal-content">
                <h3>Select Font</h3>
                <div class="font-list">
                    <div v-for="font in fonts"
                         :key="font"
                         class="font-option"
                         :style="{ fontFamily: font }"
                         @click="$emit('font-selected', font)">
                        {{ font }}
                    </div>
                </div>
                <button @click="$emit('close')">Close</button>
            </div>
        </div>
    `,
    data() {
        return {
            fonts: [
                'Arial',
                'Helvetica',
                'Times New Roman',
                'Georgia',
                'Courier New',
                'Verdana',
                'Impact',
                'Comic Sans MS',
                'Trebuchet MS',
                'Arial Black',
                'Palatino',
                'Garamond',
                'Bookman',
                'Tahoma',
                'Lucida Console'
            ]
        };
    }
});