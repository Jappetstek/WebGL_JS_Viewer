//We Need some variables here
var width = window.innerWidth -10;
var height = window.innerHeight - 20;
var camera, scene, renderer, 
    geometry, material, model, pointLight;



			function onLoad()
{
	var container = document.getElementById("container");
	 move=false;
	target="models/clock.js";
	var orgX,orgY;
	var model = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
				initScene();}
				function initScene() {

					// Grab our canvas
					var container = document.getElementById("container");
					//Create a new renderer and set the size
					renderer = new THREE.WebGLRenderer( { antialias: true } );

					renderer.setSize(width, height);
					//Add the renderer to the DOM
			        container.appendChild( renderer.domElement );
					//This is here to trigger rendering when page loads
					container.addEventListener('mousemove', ev_mousemove, false);
					//Event listeners to trigger model rotation and zooming
					container.addEventListener('mousedown', ev_mousedown, false);	
        container.addEventListener('mouseup', ev_mouseup, false);
        container.addEventListener('DOMMouseScroll', ev_mousewheel, false);
				
					//Create a new scene
			        scene = new THREE.Scene();
					
					//Create a perspective camera
			        camerad = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
			        camerad.position.z = 100;
					
			        scene.add( camerad );
				
					//Add some lights
					var dirLight = new THREE.DirectionalLight(0xffffff, 1);
					dirLight.position.set(-3, 3, 7);
					dirLight.position.normalize();
					scene.add(dirLight);
				
					var pointLight = new THREE.PointLight(0xFFFFFF, 5, 2);
					pointLight.position.set(1, 2, 1);
					scene.add(pointLight);
			 		//Spotlight for shadows
		var spotlight = new THREE.SpotLight(0xCCCCDD );
        spotlight.position.set( -6, 80, 80 );
        spotlight.castShadow = true;
		spotlight.shadowCameraVisible = false;
		scene.add(spotlight);	
// Add a plane for some reference		
		var planeGeo = new THREE.PlaneGeometry(100, 200, 10, 10);
        var planeMat = new THREE.MeshPhongMaterial({color: 0x205025});
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI/4;
        plane.position.y = -33;
        plane.receiveShadow = true;
        scene.add(plane);
		loader();
}		
					//Create a new loader for loading the model
					function loader(){
					var jsonLoader = new THREE.JSONLoader();

					//Face material variable
				
					var redPhongMaterial = new THREE.MeshFaceMaterial();
				
					//Load a model and store it in the variable XXX
					jsonLoader.load( target, function( geometry ) { 
			        model = new THREE.Mesh( geometry, redPhongMaterial);
					//Shadowable objects must be marked
					model.castShadow = true;
					model.receiveShadow =true;


					//Add the model to the scene
					scene.add(model);
					
					} );
					render();
					}
					// Add controls to rotate the object
						function ev_mousedown(e)
	{
		
		e.stopPropagation();
		//We only want to grab LMB mousedown events
		if(e.button==0){
			move=true;
			container.addEventListener('mousemove', ev_mousemove, false);
			}
		
		if(e.button!=0){
			move=false;
}
		orgX=e.clientX;
		orgY=e.clientY;
		
	}
	function ev_mouseup(e)
	{
		e.stopPropagation();
		container.removeEventListener('mousemove', ev_mousemove, false);
		return false;
	}
	function ev_mousemove(e)
	{
		e.stopPropagation();
		if(move == true)
		{
			model.rotation.y += (e.clientX - orgX)/200;
			model.rotation.x += (e.clientY - orgY)/200;
			orgX=e.clientX;
		orgY=e.clientY;
		render();
		}

		else
		{
				// This here would allow us to move the model around in our viewport
				
			/*model.position.x += (e.clientX-orgX);
			model.position.y -= (e.clientY-orgY);*/
			
			//This removes the mousemove listener we set at initScene. And renders it once. This should not be needed but I haven't figured why
			
			container.removeEventListener('mousemove', ev_mousemove, false);
			render();
		}
		
		
	}
	
	//Add mousewheel based zoom
	function ev_mousewheel(e)
	{
		e.stopPropagation();
		if(e.wheelDelta)
			camerad.position.z += e.wheelDelta/2;
		else
			camerad.position.z -= e.detail*7;
		render();
	}	
					//Render Our scene

    			function render() {

 		renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

		renderer.shadowCameraNear = 0.1;
		renderer.shadowCameraFar = 0.2;
		renderer.shadowCameraFov = 40;

		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 0.5;
		renderer.shadowMapWidth = 512;
		renderer.shadowMapHeight = 512;
        			renderer.render( scene, camerad );
    			}
				
				//We call this function from HTML when user requests new file
				
					function example(file)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET',  file, true);
		xhr.onload  = function(){
		//Remember to remove old model first
			scene.remove(model);
			target=file;
			loader();
	  }

		xhr.send("");
	}
			