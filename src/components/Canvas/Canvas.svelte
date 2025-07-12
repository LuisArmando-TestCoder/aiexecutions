<script lang="ts">
    import { onMount } from "svelte";
    import preset, { actions, consulters, events } from "scene-preset";
    import type { types } from "scene-preset";

    export const id = "home";
    export let animate: Function;
    export let setup: Function;

    actions.addSceneSetupIntrude(
        ({ presetConfiguration, camera }: types.state.CanvasState) => {
            presetConfiguration.ambient.color = "black";
            presetConfiguration.camera.cameraVectorsState.top.acceleration.x *= 5;
            presetConfiguration.camera.cameraVectorsState.top.acceleration.z *= 5;
            presetConfiguration.camera.cameraVectorsState.friction.x *= 5;
            presetConfiguration.camera.cameraVectorsState.friction.z *= 5;
            presetConfiguration.camera.fov = 10;
            camera?.setFocalLength(20);
        }
    );

    onMount(() => {
        preset({ 
            animate: (canvasState: any) => {

                animate(canvasState);

                actions.blacklistObjects({
                scene: canvasState.scene,
                    blacklist: [
                        "SimpleFloor",
                        "SimpleCube",
                        "SimpleSphere",
                        // "SimpleLightSet",
                    ],
                });
            },
            setup: (canvasState: any) => {
                setup(canvasState);
            }
        }, `#${id}`);
    });
</script>

<div class="canvas">
    <canvas id={id} />
</div>

<style lang="scss">
    .canvas {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        user-select: none;
        width: 100vw;
        height: 100vh;
        mix-blend-mode: screen;
        filter: invert(1);
    }

    canvas {
        user-select: none;
        pointer-events: none;
    }
</style>