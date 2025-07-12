import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const loaders = {
  GLTFLoader,
  FBXLoader
};

export default (
  path: string,
): Promise<{
  object3D: THREE.Group;
  animations: Map<string, (animationSpeed: number) => THREE.AnimationAction>;
}> => {
  return new Promise((resolve, reject) => {
    const extension = path.split(".").pop()?.toLowerCase();

    let LoaderClass: typeof GLTFLoader | typeof FBXLoader;
    if (extension === "gltf" || extension === "glb") {
      LoaderClass = GLTFLoader;
    } else if (extension === "fbx") {
      LoaderClass = FBXLoader;
    } else {
      reject(new Error(`Unsupported file extension: ${extension}`));
      return;
    }

    const loader = new LoaderClass();

    loader.load(
      path,
      (object) => {
        let model: THREE.Group;
        let animationsArray: THREE.AnimationClip[];

        if (object instanceof THREE.Group) {
          model = object;
          animationsArray = [];
        } else if ("scene" in object) {
          model = (object as GLTF).scene;
          animationsArray = (object as GLTF).animations;
        } else {
          reject(new Error("Unsupported object type loaded."));
          return;
        }

        model.traverse((child) => {
          child.castShadow = true;
        });

        const mixer = new THREE.AnimationMixer(model);
        const animations = new Map<string, (animationSpeed: number) => THREE.AnimationAction>();

        animationsArray.forEach((clip) => {
          const action = mixer.clipAction(clip);
          animations.set(clip.name, (animationSpeed: number) => {
            mixer.update(animationSpeed);
            return action;
          });
        });

        resolve({ object3D: model, animations });
      },
      undefined,
      reject
    );
  });
};
