class OrbitCamera {
    constructor(min_distance, max_distance) {
        this.min_distance = min_distance;
        this.max_distance = max_distance;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.camera.userData = this;
        this.camera.matrixAutoUpdate = false;

        this.angle = new THREE.Vector2(0, 0);

        this.distance = min_distance;

        this.x_rot_scale = 1.5;
        this.y_rot_scale = 1.0;
        this.zoom_scale = 1.0;

        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);
        this.forward = new THREE.Vector3(0, 0, -1);
    }

    add_to(other) {
        other.add(this.camera);
    }

    remove_from(other) {
        other.remove(this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    update(dt) {
        var translate = new THREE.Matrix4();
        var vrotate = new THREE.Matrix4();

        translate.makeTranslation(0, 0, this.distance);
        vrotate.makeRotationX(-this.angle.y);
        this.camera.matrix.makeRotationY(this.angle.x);

        this.camera.matrix.multiply(vrotate.multiply(translate));
        this.camera.updateProjectionMatrix();

        // Track this in case others need it
        this.camera.position.setFromMatrixPosition(this.camera.matrix);

        this.up.set(0, 1, 0).transformDirection(this.camera.matrix);
        this.right.set(1, 0, 0).transformDirection(this.camera.matrix);
        this.forward.set(0, 0, -1).transformDirection(this.camera.matrix);
    }
}
