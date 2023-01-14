<script lang="ts">
    const radius: number = 50;
    let strokeWidth: number = 5;
    const size: number = radius * 2;

    export let score: number = 0;
    export let totalScore: number;
    export let color: string;

    let isAnimating: boolean = false;
    const playAnimation = () => {
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 250);
    };

    $: score && playAnimation();
</script>

<div>
    <svg viewBox="{`0 0 ${size} ${size}`}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
            r="{radius - strokeWidth / 2}"
            cx="{size / 2}"
            cy="{size / 2}"
            style:stroke-width="{`${strokeWidth}px`}"
            style:stroke="{isAnimating ? 'var(--surface-3)' : 'var(--surface-2)'}"></circle>
        <circle
            r="{radius - strokeWidth / 2}"
            cx="{size / 2}"
            cy="{size / 2}"
            id="active"
            style:stroke="{color}"
            style:stroke-width="{`${strokeWidth}px`}"
            stroke-dasharray="{`
        ${(2 * Math.PI * radius * score) / totalScore}
        ${2 * Math.PI * radius * ((totalScore - score) / totalScore)}
      `}"
            stroke-dashoffset="{0.25 * (2 * Math.PI * radius)}"></circle>
        <g
            stroke-width="3"
            style:stroke="{color}"
            class="animation-group"
            class:-active="{isAnimating}"
            class:-inactive="{!isAnimating}"
        >
            <path d="M70 30.6066L80.6066 20"></path>
            <path d="M30.6066 70L20 80.6066"></path>
            <path d="M29.6066 29.6066L19 19"></path>
            <path d="M70 70L80.6066 80.6066"></path>
            <path d="M50 15V0"></path>
            <path d="M85 50H100"></path>
            <path d="M50 85V100"></path>
            <path d="M15 50H0"></path>
        </g>
    </svg>
    <span id="label">{score}</span>
</div>

<style lang="postcss">
    div {
        max-inline-size: var(--size-8);
        display: grid;
        grid-template: 'center' 1fr /1fr;
        place-items: center;
    }

    svg {
        inline-size: 100%;
        grid-area: center;
    }

    #label {
        grid-area: center;
        inline-size: fit-content;
        block-size: fit-content;
        margin: 0;
    }

    circle {
        fill: transparent;
    }

    #active {
        stroke: var(--surface-2);
        stroke-linecap: round;
        stroke-miterlimit: 10;
        stroke-linejoin: round;
        transition: all 500ms ease-in-out;
    }

    .animation-group.-inactive {
        opacity: 0;
    }

    .animation-group.-active path {
        --arrayMax: 25;
        stroke-dasharray: var(--arrayMax);
        stroke-dashoffset: 25;
        opacity: 1;
        animation: dash 250ms var(--ease-elastic-3) forwards;
    }

    @keyframes dash {
        0% {
            stroke-dashoffset: var(--arrayMax);
            opacity: 1;
        }
        90% {
            stroke-dashoffset: 0;
            opacity: 1;
        }

        100% {
            stroke-dashoffset: 0;
            opacity: 0;
        }
    }
</style>
