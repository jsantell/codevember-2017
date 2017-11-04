import { Bone, Skeleton, SkinnedMesh,Vector4, Vector3, Face3, FlatShading, MeshBasicMaterial, DoubleSide, Mesh, Object3D, Geometry } from 'three';

const points = 4;
const radius = 0.9;
const rings = 100;
const heightPerRing = 0.3;
export default class Vine extends Object3D {
  constructor() {
    super();

    const indices = [];
    //const indices = new Float32Array((rings - 1) * points * 2);
    const vertices = new Float32Array(rings * points * 3);
    this.geometry = new Geometry();
    const bones = [];
    this._generateVertices(this.geometry.vertices,
                           this.geometry.faces,
                           this.geometry.skinIndices,
                           this.geometry.skinWeights,
                           bones);
    this.skeleton = new Skeleton(bones);
    //this.geometry.addAttribute('index', new BufferAttribute(indices, 1));
    //this.mesh = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xff0000, shading: FlatShading, side: DoubleSide }));
    //this.mesh = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide }));
    this.mesh = new SkinnedMesh(this.geometry, new MeshBasicMaterial({ skinning: true, color: 0xffccff }));
    this.mesh.add(bones[0]);
    this.mesh.bind(this.skeleton);
    this.mesh.frustumCulled = false;
    this.add(this.mesh);
/*
            let skeletonHelper = new THREE.SkeletonHelper(this.mesh );
                    skeletonHelper.material.linewidth = 10;
                            this.add( skeletonHelper );
    */
  }

  /*
  0 1  4 5
  3 2  7 6
  */
  _generateVertices(vertices, faces, skinIndices, skinWeights, bones) {
    for (let j = 0; j < rings; j++) {
      const bone = new Bone();
      bone.position.set(0, j*heightPerRing,0);
      bones.push(bone);
      for (let i = 0; i < points; i++) {
        const theta = Math.PI * 2 * i / points;
        vertices.push(new Vector3(Math.sin(theta) * radius, j*heightPerRing, Math.cos(theta) * radius));
        skinIndices.push(new Vector4(j, j-1, j-2, j-3));
        skinWeights.push(new Vector4(0.45, 0.25, 0.2, 0.1));
      }
      if (j !== 0) {
        for (let i = 0; i < points; i++) {
          const thisPoint = j * points + i;
          const nextPoint = (i === points - 1) ?
                            (j * points) :
                            (j * points + i + 1);
          const belowPoint = (j - 1) * points + i;
          const nextBelowPoint = (j - 1) * points + i + 1;
          faces.push(new Face3(belowPoint, thisPoint, nextPoint));
          faces.push(new Face3(belowPoint, nextBelowPoint, nextPoint));
        }
      }
    }
    for (let i = 0; i < bones.length - 1; i++) {
      bones[i].add(bones[i + 1]);
    }
  }
}
