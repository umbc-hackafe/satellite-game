class Game {
    constructor() {
        this.previous_time = 0;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas3d.get(0),
        });

        this.world = new World({
            id: 0,
            radius: 4,
            mass: 100,
        });
        this.world.add_to(this.scene);

        this.camera = new OrbitCamera(this.world.radius * 2, this.world.radius * 10);
        this.camera.add_to(this.scene);

        var sat = new Satellite({
            id: 1,
            position: {
                x: 0,
                y: 0,
                z: this.world.radius * 1.5,
            },
            velocity: {
                x: 7.5,
                y: 7.5,
                z: 0,
            },
            mass: 1,
        });

        sat.add_to(this.scene);

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
