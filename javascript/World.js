class World {
    constructor(args) {
        // REQUIRES:
        // 'id'
        // 'radius'
        // 'mass'
        this.id = args.id;
        this.radius = args.radius;
        this.masss = args.mass;
        
        this.geom = new THREE.IcosahedronGeometry(1, 3);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            map: THREE.ImageUtils.loadTexture('globe-tex.png'),
        });

        this.base_mesh = new THREE.Mesh(this.geom, this.material);
        this.wire_mesh = new THREE.WireframeHelper(this.base_mesh, 0x053a30);

        this.base_mesh.userData = this;
        this.wire_mesh.material.transparent = true;
        this.wire_mesh.material.blending = THREE.AdditiveBlending;

        this.base_mesh.scale.set(this.radius, this.radius, this.radius);
    }

    add_to(other) {
        other.add(this.base_mesh);
        other.add(this.wire_mesh);
    }

    remove_from(other) {
        other.remove(this.base_mesh);
        other.remove(this.wire_mesh);
    }
}
