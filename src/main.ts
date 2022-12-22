import './app.css';
import App from './App.svelte';

const root = document.getElementById('app');

if (!root) {
    throw new Error('Could not find root element');
}

const app = new App({
    target: root,
});

export default app;
