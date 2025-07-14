import * as THREE from 'three';

type GLTF = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export default async (
  path: string
): Promise<{
  object3D: THREE.Group;
  animations: Map<string, (animationSpeed: number) => THREE.AnimationAction>;
}> => {
  const extension = path.split('.').pop()?.toLowerCase();

  const [gltfModule, fbxModule] = await Promise.all([
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/loaders/FBXLoader.js')
  ]);

  const loaders: Record<string, any> = {
    gltf: gltfModule.GLTFLoader,
    glb: gltfModule.GLTFLoader,
    fbx: fbxModule.FBXLoader
  };

  const LoaderClass = loaders[extension ?? ''];
  if (!LoaderClass) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }

  return new Promise((resolve, reject) => {
    const loader = new LoaderClass();

    loader.load(
      path,
      (object: any) => {
        let model: THREE.Group;
        let animationsArray: THREE.AnimationClip[];

        if (object instanceof THREE.Group) {
          model = object;
          animationsArray = [];
        } else if ('scene' in object) {
          model = (object as GLTF).scene;
          animationsArray = (object as GLTF).animations;
        } else {
          reject(new Error('Unsupported object type loaded.'));
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
