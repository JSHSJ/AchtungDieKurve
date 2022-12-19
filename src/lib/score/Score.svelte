<script lang="ts">
  const radius: number = 6;
  const strokeWidth: number = 1;
  const size: number = radius * 2;

  export let score: number = 0;
  export let totalScore: number;
  export let color: string;
</script>

<div>
  <svg
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      r={radius - (strokeWidth / 2)}
      cx={size / 2}
      cy={size / 2}
      id="inactive"
    />
    <circle
      r={radius - (strokeWidth / 2)}
      cx={size / 2}
      cy={size / 2}
      id="active"
      style:stroke={color}
      style:stroke-width={`${strokeWidth}px`}
      stroke-dasharray={`
        ${(2 * Math.PI * radius * score) / totalScore}
        ${2 * Math.PI * radius * ((totalScore - score) / totalScore)}
      `}
      stroke-dashoffset={0.25 * (2 * Math.PI * radius)}
    />
  </svg>
  <span id="label" as="span">{score}</span>
</div>

<style lang="postcss">
  div {
    max-inline-size: var(--size-8);
    display: grid;
    grid-template: "center" 1fr /1fr;
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

  #inactive {
    stroke: var(--surface-2);
  }

  #active {
    stroke: var(--surface-2);
    stroke-linecap: round;
    stroke-miterlimit: 10;
    stroke-linejoin: round;
    transition: all 500ms ease-in-out;
  }
</style>