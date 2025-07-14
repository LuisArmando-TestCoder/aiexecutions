
<script lang="ts">
	import { onMount } from 'svelte';

	let percentage = 0;
	let visible = true;
    export let callback: (hasLoaded: boolean) => void;

	onMount(() => {
		const interval = setInterval(() => {
			percentage += 1;
			if (percentage >= 100) {
				clearInterval(interval);
				setTimeout(() => {
					visible = false;
                    callback(!visible);
				}, 50);
			}
		}, 15);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="wrapper" style="opacity: {!visible ? 0 : 1};">
    <div class="loader-container" style="opacity: {!visible ? 0 : 1};">
        <div class="loader loader4">
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <div>
                                                    <div>
                                                        <div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="percentage">{percentage}%</div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        transition: .5s;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        justify-content: center;
        place-items: center;
        background: var(--color-x-gradient);
        user-select: none;
        pointer-events: none;
        --color: white;
    }

	.loader-container {
        display: block;
        --size-unit: 200px;
        user-select: none;
        pointer-events: none;
		position: relative;
		width: var(--size-unit);
		height: var(--size-unit);
		margin: 75px auto;
		transition: opacity 0.5s ease-in-out;
	}

	.percentage {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 14px;
		color: var(--color);
		font-family: var(--font-title);
		font-weight: bold;
        text-align: center;
	}

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes rotate2 {
        0% {
            transform: rotate(0deg);
            border-top-color: var(--color);
        }
        50% {
            transform: rotate(180deg);
            border-top-color: var(--color);
        }
        100% {
            transform: rotate(360deg);
            border-top-color: var(--color);
        }
    }

    body {
        background: #f9f9f9;
        padding-bottom: 100px;
    }

    h1,
    h3 {
        display: block;
        margin: 0px auto;
        text-align: center;
        font-family: "Tahoma";
        font-weight: lighter;
        color: var(--color);
        letter-spacing: 1.5px;
    }

    h1 {
        margin: 50px auto;
    }

    @mixin loaderDivMixin {
        border-radius: 50%;
        padding: 8px;
        border: 2px solid transparent;
        animation: rotate linear 3.5s infinite;
    }

    .loader {
        pointer-events: none;
        position: relative;
        margin: 75px auto;
        width: var(--size-unit);
        height: var(--size-unit);
        display: block;
        overflow: hidden;
        top: -37.5%;
        div {
            opacity: .95;
            height: 100%;
        }
    }

    /* loader 1 */
    .loader1,
    .loader1 div {
        @include loaderDivMixin;
        border-top-color: var(--color);
        border-bottom-color: var(--color);
    }

    /*loader 2  */
    .loader2,
    .loader2 div {
        @include loaderDivMixin;
        border-top-color: var(--color);
        border-left-color: var(--color);
        border-right-color: var(--color);
    }

    /*loader 3  */
    .loader3,
    .loader3 div {
        @include loaderDivMixin;
        border-top-color: var(--color);
        border-left-color: var(--color);
        animation-timing-function: cubic-bezier(0.55, 0.38, 0.21, 0.88);
        animation-duration: 3s;
    }

    /* loader 4 */
    .loader4,
    .loader4 div {
        @include loaderDivMixin;
        border-radius: 50%;
        padding: 4px;
        animation: rotate2 4s infinite linear;
    }

    div:hover {
        animation-play-state: paused;
    }

    .loader,
    .loader * {
        will-change: transform;
    }
</style>
