class Satellite {
    constructor(args) {
        // REQUIRES:
        // 'id': int
        // 'position': {'x': float, 'y': float, 'z': float}
        // 'velocity': {'x': float, 'y': float, 'z': float}
        // 'mass': float
        this.id = args.id;

        this.mass = args.mass;
        
        this.geom = new THREE.BoxGeometry(0.5, 0.1, 1.0);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xff1010,
        });
        this.material.transparent = true;
        this.material.blending = THREE.AdditiveBlending;

        this.box = new THREE.Mesh(this.geom, this.material);
        this.box.position.set(args.position.x, args.position.y, args.position.z);
        this.box.userData = this;
        this.wire_mesh = new THREE.WireframeHelper(this.box, 0xffffff);

        this.velocity = new THREE.Vector3(args.velocity.x, args.velocity.y, args.velocity.z);

        this.time = 0;
    }

    add_to(other) {
        other.add(this.box);
        other.add(this.wire_mesh);
    }

    remove_from(other) {
        other.remove(this.box);
        other.remove(this.wire_mesh);
    }

    update(dt) {
        this.time += dt;
        if(this.time > 1) {
            var pos = this.box.position.clone();
            var len = pos.length();
            len = len * len * len;
            pos.negate();
            pos.multiplyScalar(G * game.world.mass * this.mass / len);
            
            this.velocity.add(pos.multiplyScalar(dt / this.mass));
            
            this.box.position.add(this.velocity.clone().multiplyScalar(dt));

            var theta = Math.atan2(this.box.position.x, this.box.position.z);
            var phi = Math.acos(this.box.position.y / this.box.position.length());

            console.log(theta);
            console.log(phi);
            console.log('loop');
            
            this.box.rotation.set(phi, theta, 0, 'YXZ');
        }
    }
}
