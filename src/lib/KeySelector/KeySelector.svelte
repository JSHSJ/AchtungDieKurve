<script lang="ts">
    import { disallowedKeys, mapDisplayKey } from './KeyUtils';

    export let value: string;
    export let id: string;
    export let name: string;

    let displayValue: string = mapDisplayKey(value);

    /** Selects the text inside a text node when the node is focused */
    const clearOnFocus = (node: HTMLInputElement) => {
        const handleFocus = (event) => {
            displayValue = '<Press a key...>';
        };

        node.addEventListener('focus', handleFocus);

        return {
            destroy() {
                node.removeEventListener('focus', handleFocus);
            },
        };
    };

    const blurOnInput = (node: HTMLInputElement) => {
        const handleKey = (event) => {
            event.preventDefault();
            if (event.key === 'Escape') {
                node.blur();
                displayValue = mapDisplayKey(value);
                return;
            }

            if (disallowedKeys.has(event.key)) {
                // TODO: display message
                return;
            }

            value = event.key;
            displayValue = mapDisplayKey(value);

            node.blur();
        };

        node.addEventListener('keydown', handleKey);

        return {
            destroy() {
                node.removeEventListener('keydown', handleKey);
            },
        };
    };
</script>

<input
    type="text"
    name={name}
    id={id}
    required
    bind:value={displayValue}
    use:blurOnInput
    use:clearOnFocus
/>
