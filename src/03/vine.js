import { Vector3, Face3, FlatShading, MeshBasicMaterial, DoubleSide, Mesh, Object3D, Geometry } from 'three';

const points = 8;
const radius = 1;
const rings = 8;
export default class Vine extends Object3D {
  constructor() {
    super();

    const indices = [];
    //const indices = new Float32Array((rings - 1) * points * 2);
    const vertices = new Float32Array(rings * points * 3);
    this.geometry = new Geometry();
    this._generateVertices(this.geometry.vertices, this.geometry.faces);
    //this.geometry.addAttribute('index', new BufferAttribute(indices, 1));
    //this.mesh = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xff0000, shading: FlatShading, side: DoubleSide }));
    //this.mesh = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide }));
    this.mesh = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xeeeeee }));
    this.mesh.frustumCulled = false;
    this.add(this.mesh);
    // this.geometry.computeVertexNormals();
    console.log(vertices, indices);
  }

  /*
  0 1  4 5
  3 2  7 6
  */
  _generateVertices(vertices, faces) {
    for (let j = 0; j < rings; j++) {
      for (let i = 0; i < points; i++) {
        const theta = Math.PI * 2 * i / points;
        vertices.push(new Vector3(Math.sin(theta) * radius, j, Math.cos(theta) * radius));
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
  }
}
