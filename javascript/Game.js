class Game {
    constructor() {
        this.previous_time = 0;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas3d.get(0),
        });

        this.camera = new OrbitCamera(8, 100);
        this.camera.add_to(this.scene);

        this.world = new World();
        this.world.add_to(this.scene);

        this.resize();
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.resize();
    }

    update(current_time) {
        var dt = (current_time - this.previous_time) / 1000;
        this.previous_time = current_time;
        
        this.scene.traverse(function(obj) {
            if(typeof obj.userData.update === 'function') {
                obj.userData.update(dt);
            }
        });

        this.renderer.render(this.scene, this.camera.camera);
    }
}
