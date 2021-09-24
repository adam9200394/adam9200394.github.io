import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

class pathGroup {
    constructor(pathColor = 0xd3c41d, pathAction = 0){
      this.pathColor = pathColor;
      this.pathAction = pathAction;
      this.pathElement = [];
      this.pathwieght = 0  ;
    }
    calculatePathWieght () {
        let wieghts = 0;
        this.pathElement.forEach((ele)=> {
            wieghts = wieghts + (ele.obj.position.x + ele.obj.position.y + ele.obj.position.z) ;

        });
        wieghts = wieghts * .1;
        return wieghts;
    }
}
//all action buttons
const init_btn = document.getElementById("init-btn");
const play_btn = document.getElementById("play-btn");
const visualize_btn = document.getElementById("visualize");
const readyOne_btn = document.getElementById("ready-one");
const readytwo_btn = document.getElementById("ready-two");
export const new_action_btn = document.getElementById("new-action-btn");
// html elements controller
const canvas = document.getElementById("threeDCanvas");
const main_content = document.getElementById("main-content");
const leftContent = document.getElementById("left-content");
const rightContent = document.getElementById("right-content");
const bottomContent = document.getElementById("bottom-content");
const topContent = document.getElementById("top-content");
const data_div = document.getElementById("data-div");
const visualize_div = document.getElementById("visualize-div");
const actions_div = document.getElementById("actions-div");
const toast_div = document.getElementById("toast");
const attr_div = document.getElementById("attr-div");
const system_data_left = document.getElementById("system-data-left");
const net_atrr = document.getElementById("net-atrr");
const mech_comp = document.getElementById("mech-comp");

//const btn_color = document.getElementById("btn_color");

//value varibles ==================================================
let colour = 0x0000ff;
let time = 0;
const width = 10;
const height = 10;
const intensity = 1;
const colors = [ 0xd3c41d, 0x88ed7d, 0xe12323, 0xe123cb, 0x23e1c8, 0xe16c23];
const pathGroups = [];
const pointArray = [];
let init_ready = false;
const size = 800;
const divisions = 50;
let new_action_err_msg = false;


//init data
export let data = {};
data.actions = [];
data.effectors = [];
export function getData() {
    data.param =parseInt(document.getElementById("par").value);
    data.segments =parseInt(document.getElementById("segments").value);
    data.bones =parseInt(document.getElementById("bones").value);
    data.groups =parseInt(document.getElementById("groups").value);
    
}


//init pathgroups
/* for (let i=0; i < colors.length; i++){
    pathGroups.push(new pathGroup(colors[i]));
} */
//console.log(pathGroups)



// init scene =======================================================================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .01, 1000 );
camera.position.set( 20, 20, 200 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


// ===================================== beging event =========================================
init_btn.addEventListener("click", ()=> {
    if(!(data.actions.length > 0)){ 
        if(main_content.lastChild.id == "m-error-div") {
            return;
        } else {
            let div = document.createElement("div");
            let text = document.createElement("p");
            text.innerText = 'no actions to begin simulation please create action';
            div.classList.add("section");
            div.id = 'm-error-div';
            text.classList.add('centered-text');
            text.classList.add("error-msg");
            div.appendChild(text);
            main_content.appendChild(div);
        }
      
    } else {
        window.addEventListener("popstate", ()=> {
            history.pushState(null,null,window.location.pathname);
        }, false)
        canvas.classList.add("open");
        canvas.classList.remove('closed')
        init_btn.innerText = "";
        main_content.classList.add("visiblity");
        setTimeout(() => {
            canvas.appendChild(renderer.domElement);
            canvas.classList.remove("black");
            leftContent.classList.remove("visiblity");
            rightContent.classList.remove("visiblity");
            bottomContent.classList.remove("visiblity");
            topContent.classList.remove("visiblity");
            document.body.removeChild(main_content);
            document.getElementsByTagName("title")[0].innerText = 'simulator';
        },700);

            // create elements 
        
            //get data 
            getData();
             /* ------ add meshes -------*/
             //sphers geometry ------------------------------
            let param = data.param;
            for(let i= 0; i< param; i++){
                let x= (Math.random() * window.innerHeight) / -3;
                let z= Math.random() * 160;
                let y = (Math.random() * window.innerWidth) / 3 ;
                let colordata = colors[Math.floor(Math.random() * colors.length)] ;
                const geometry = new THREE.SphereGeometry( 2, 4, 4 );
                const material = new THREE.MeshBasicMaterial( { color: colordata } );
                const sphere = new THREE.Mesh( geometry, material );
                sphere.position.set(x, y, z);
                let pointObject = {"obj": sphere, colordata}
                pointArray.push(pointObject);
                scene.add( sphere );
            }
           
             // work on data
            let reslution = data.segments;
            /*  */
            for(let i=0; i<data.actions.length; i++){
                let action_btn = document.createElement("button");
                action_btn.classList.add("action");
                action_btn.id = data.actions[i].action_name;
                action_btn.innerText = data.actions[i].action_name;
                actions_div.appendChild(action_btn);
                let action_point_arry = [];
               
                for(let j=0; j< reslution; j++){
                    let rand = Math.floor(Math.random() * pointArray.length);
                    let point =  pointArray[rand];
                    action_point_arry.push(point);
                }


                let g = new pathGroup(undefined, data.actions[i].action_name);
                for(let j=0; j<action_point_arry.length;j++){
                    g.pathElement.push(action_point_arry[j]);
                }

                pathGroups.push(g);
               
                action_btn.addEventListener("click", (e) => {
                    const vertexLine = [];
                    //console.log(action_point_arry);
                    let text = document.createElement('p');
                    text.classList.add("text");
                    text.classList.add("white-text");
                    text.classList.add("toast");
                    text.classList.add("inline");
                    text.innerText = e.target.id + " + 1";
                    for(let k=0; k< action_point_arry.length; k++){
                        let pointVertex = createVertex(action_point_arry[k].obj.position);
                        vertexLine.push(pointVertex);  
                    } 
                    
                    let line = draw(vertexLine, colors[Math.floor(Math.random() * colors.length)] );
                    scene.add(line);
                    bottomContent.appendChild(text);
                   
                    setTimeout(() => {
                        bottomContent.removeChild(text);
                    }, 1500);
                    
                });
                
            }
            
            

        //3d scene content ===========================================================================
        //============================================================================================
            // axes helper
            const axesHelper = new THREE.AxesHelper( 1000 );
            scene.add( axesHelper );

            //grid helper
            const gridHelper = new THREE.GridHelper( size, divisions );
            scene.add( gridHelper );

            // scene lighting
            const spotLight = new THREE.SpotLight( 0xffffff );
            spotLight.position.set( 100, 1000, 100 );

            spotLight.castShadow = true;
            spotLight.power = 200;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 500;
            spotLight.shadow.camera.far = 4000;
            spotLight.shadow.camera.fov = 30;

            scene.add( spotLight );
            
           
          
            
            // connect vertex  -------------------------------
           /*  for (let i=0; i< pathGroups.length; i++){
            for(let j=0; j<pointArray.length; j++) {
            if(pathGroups[i].pathColor == pointArray[j].colordata){
                pathGroups[i].pathElement.push(pointArray[j]);
                }
              }
            }
            //console.log(pathGroups);

            //console.log( pathGroups[0].pathElement[0].obj.position);
            visualize_btn.addEventListener("click", ()=> {
               
                    const vertexLine = [];
                    for(let i=0; i<pathGroups[0].pathElement.length; i++) {
                        let pointVertex = createVertex(pathGroups[0].pathElement[i].obj.position);
                        vertexLine.push(pointVertex);
                    }
                console.log(vertexLine);
                //console.log(draw(vertexLine, pathGroups[0].pathColor));
                // scene.add(draw(vertexLine, pathGroups[0].pathElement[i].obj.position));
                   
                    
                
            }); */
            


            bottomContent.innerHTML = `<p class="text inline"> parameters: ${param} </p>`;
            data_div.innerHTML = `<h4> arttibutes: </h4> <p class="sub-text"> muscle-groups : ${data.groups} </p>  <p class="sub-text">bones : ${data.bones}</p>  <p class="sub-text">segments : ${data.segments}</p>`


            renderer.render( scene, camera );

        //end of 3d scene content==========================================================================
        //=================================================================================================

            }

    


});

/* ====================================scene functions============================================ */
function init() {
 // later use
}

function render() {
   //later use
}
function animate() {
	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
     
	renderer.render( scene, camera );   

}


/* =========================== helper function ===================================================*/
// draw from points

 function draw (points, color) {
    const material = new THREE.LineBasicMaterial( { color: color } );
  
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
  
    const line = new THREE.Line( geometry, material );
    return line;

}
 
// set number of points
 function createVertex (location) {   

    return new THREE.Vector3( location.x, location.y, location.z );;
} 
 
/* ==========================================other event listeners================================ */

play_btn.addEventListener("click", ()=> {
    animate();
});

// ==========================================btns event listeners ===================================
//===================================================================================================
//===================================================================================================


readyOne_btn.addEventListener("click", () => {
  getData();
  let groups = data.groups;
  let bones = data.bones;
  let div = document.createElement("div");
  div.classList.add("sub-section");
  div.classList.add("pop-section");
  div.classList.add("closed");
  div.classList.add("visiblity");

  if(bones > groups) {
      let msg = document.createElement("p");
      msg.classList.add("error-msg");
      msg.innerText = "bone number cannot be bigger that muscle groups."
      div.appendChild(msg);
      div.id = 'ready_one_error';
      div.classList.remove("visiblity");
      div.classList.remove("closed");
      div.classList.add("open");
      for(let i=0; i < document.getElementsByClassName("section")[0].children.length; i++) {
        if( document.getElementsByClassName("section")[0].children[i].id == "ready_one_error"){
          return;
        }
    }
      document.getElementsByClassName("section")[0].appendChild(div);
      return;
  }
  let h4 = document.createElement("h4");
  let note = document.createElement("p");
  let set_attr_btn = document.createElement("button");
  h4.innerText = "define realshionships : ";
  h4.classList.add('white-text')
  div.appendChild(h4); 
  note.innerText = "0% no effect at all to 100% full effect";
  note.classList.add("note-light");
  set_attr_btn.innerText = "set component attributes";
  set_attr_btn.classList.add('btn');
  div.appendChild(note);
  for(let i=0; i < document.getElementsByClassName("section")[0].children.length; i++) {
      if( document.getElementsByClassName("section")[0].children[i].id == "ready_one_error"){
        document.getElementsByClassName("section")[0].removeChild(document.getElementsByClassName("section")[0].children[i]);
      }
  }
  
  if(!init_ready) document.getElementsByClassName("section")[0].appendChild(div);
  init_ready = true;
  setTimeout(() => {
    div.classList.remove("visiblity");
     div.classList.remove("closed");
     div.classList.add("open");
     
}, 100);

for(let i=0; i< bones; i++) {
    let div2 = document.createElement('div');
    div2.classList.add('effector');
    let p = document.createElement("p");
    let divider = document.createElement("div");
    divider.classList.add('divider');
    p.classList.add('text');
    p.innerText = "bone." + i;
    div2.appendChild(p);
     // xyz begin locations
     let x = document.createElement('input');
     let y = document.createElement('input');
     let z = document.createElement('input');
     let xyz = document.createElement('div');
     x.placeholder = "x"
     y.placeholder = "y"
     z.placeholder = "z"
     x.type = "number";
     y.type = "number";
     z.type = "number";
     x.value = 0 + i;
     y.value = 0;
     z.value = 0;
     x.classList.add("small-input");
     y.classList.add("small-input");
     z.classList.add("small-input");
     xyz.classList.add("inline");
     xyz.appendChild(x)
     xyz.appendChild(y)
     xyz.appendChild(z)
     // xyz end locations
     let x2 = document.createElement('input');
     let y2 = document.createElement('input');
     let z2 = document.createElement('input');
     let xyz2 = document.createElement("div");
     x2.placeholder = "x"
     y2.placeholder = "y"
     z2.placeholder = "z"
     x2.type = "number";
     y2.type = "number";
     z2.type = "number";
     x2.value = 1 + i;
     y2.value = 0;
     z2.value = 0;
     x2.classList.add("small-input");
     y2.classList.add("small-input");
     z2.classList.add("small-input");
     xyz2.classList.add("inline");
     xyz2.appendChild(x2);
     xyz2.appendChild(y2);
     xyz2.appendChild(z2);
    for(let j=0; j<groups; j++){
        let input = document.createElement('input');
       //  // // // // // 
        let label =  document.createElement('label');
        input.classList.add('input-text');
        input.type = "range";
        input.name = 'group.' +j ;
        input.min = "0";
        input.max = "100";
        input.value = "0";
        label.for = 'group.' +j ;
        label.innerText = 'group.' +j;
       /*  input.placeholder = 'group ' +j + ' effect'; */
        
        div2.appendChild(input);
        div2.appendChild(label);
       
    }

    div.appendChild(div2);
    div.appendChild(xyz);
    div.appendChild(xyz2);
    div.appendChild(divider);

  }

  let btn_1 = document.createElement("button");
  let btn_2 = document.createElement("button");
  let div3 = document.createElement("div");
  btn_1.classList.add("btn");
  btn_1.classList.add("btn-pop");
  btn_2.classList.add("btn");
  btn_2.classList.add("btn-pop");
  btn_1.innerText = "  ok  ";
  btn_2.innerText = " rest ";
  div3.appendChild(btn_1);
  div3.appendChild(btn_2);
  div.appendChild(div3);

  btn_1.addEventListener("click", () => {
    div.classList.add("closed");
    div.classList.remove("open");
    div.classList.add("visiblity");
    setTimeout(() => {
        let select = document.getElementsByClassName("section")[0];
        select.removeChild(select.lastChild);
    }, 100);
    div3.removeChild(div3.firstChild);
    div3.removeChild(div3.firstChild);
    let text = document.createElement('p');
    text.classList.add("text");
    text.classList.add("inline");
    text.innerText = "components ready.";
    div3.appendChild(text);
    div3.appendChild(btn_2);
    div3.appendChild(set_attr_btn);
    div3.classList.add("centered");
    setTimeout(() => {
        document.getElementsByClassName("section")[0].appendChild(div3);
    }, 101);
   for(let i=0; i< div.children.length; i++){
       if( div.children[i].classList.contains('effector')){
        let value = [];
        let bone = '';
        let effector = {};
        for(let j=0; j<div.children[i].children.length; j++){
            if(div.children[i].children[j].tagName == "INPUT"){
                 value.push(div.children[i].children[j].value);
            }

            if(div.children[i].children[j].tagName == "P"){
                bone = div.children[i].children[j].innerText;
              }

         }
        effector = { bone, value };
        data.effectors.push(effector);
        /* console.log(data.effectors); */
       }      
   }

   set_attr_btn.addEventListener("click", ()=> {
    attr_div.classList.remove("collabse");
    attr_div.classList.remove("closed");
    attr_div.classList.add("open");
    setattr();
    setData();

  });
   
  });


  btn_2.addEventListener("click", () => {
    div.classList.remove("open");
    div.classList.add("closed");
    div.classList.add("visiblity");
    let select = document.getElementsByClassName("section")[0];
    select.removeChild(select.lastChild);
    init_ready = false;
    
    
  });

 
});

readytwo_btn.addEventListener("click", ()=> {
    net_atrr.innerHTML = "";
    getData();
    let text = document.createElement('p');
    let text2 = document.createElement('p');
    
    console.log(data);
    text.innerText = ">parameters: " + data.param ;
    text2.innerText = ">resluation: " + data.segments ; 

    net_atrr.appendChild(text);
    net_atrr.appendChild(text2);
    console.log("CLIC");
   

});

new_action_btn.addEventListener("click", ()=> {
    getData();
    let section = document.getElementById("new-action");
    let div = document.createElement('div');
    div.classList.add("padding");
    let div2  = document.createElement('div');
    let input = document.createElement("input"); 
    let save_btn = document.createElement("button");  
    if(!init_ready) {
        section.classList.remove('visiblity');
        let error_msg = document.createElement('p');
        error_msg.innerText = "save the mechinceal arttibutes first to initiate actions (press ready button).";
        error_msg.classList.add('centered-text');
        error_msg.classList.add('error-msg');
        div.id = "error-div";
        if(!new_action_err_msg){
            div.appendChild(error_msg);
            section.appendChild(div);
        }
        new_action_err_msg = true;
       
    } else {
        if(section.children.length > 0){
            if(section.children[0].id == "error-div"){
                let error_div = document.getElementById("error-div");
                section.removeChild(error_div);
            }
        }
        
        section.classList.remove('visiblity');
        input.type = 'text';
        input.name = 'action-name';
        input.id = 'action-name';
        input.placeholder = 'action name';
        input.classList.add('input-text');
        input.classList.add('inline');
        save_btn.classList.add('btn');
        save_btn.innerText = 'save action';
        for(let i=0; i<data.groups;i++){
            let input = document.createElement('input');
            let label =  document.createElement('label');
            input.classList.add('input-text');
            input.type = "range";
            input.name = 'group.' +i ;
            input.min = "0";
            input.max = "100";
            input.value = "0";
            input.id = 'group.' +i;
            label.for = 'group.' +i;
            label.innerText = 'group.' +i;
            div2.appendChild(input);
            div2.appendChild(label);
        }
    
        div.appendChild(input);
        div.appendChild(save_btn);
        div.appendChild(div2);
        section.appendChild(div);
        save_btn.addEventListener("click", ()=> {
            let name = document.getElementById('action-name').value;
            let values = [] ;
            for(let i=0; i<div2.children.length; i++){
                if(div2.children[i].type == "range"){
                 
                    values.push( div2.children[i].value );
                }
            }
         let action = {action_name: name, values }
        
          let saved = document.createElement("p");
          saved.classList.add("white-text");
          saved.innerHTML = 'action : <span class="saved-action-name">' + action.action_name + '</span> saved';
          let div3 = document.createElement("div");
          div3.id = action.action_name;
          div3.classList.add("dark-background");
          div3.appendChild(saved);
          div.removeChild(input);
          div.removeChild(save_btn);
          div.removeChild(div2);
          data.actions.push(action);
          div.appendChild(div3);
          div3.addEventListener("click", ()=> {
            attr_div.classList.remove("collabse");
            attr_div.classList.remove("closed");
            attr_div.classList.add("open");
            let txt_1 = document.createElement("h4");
            txt_1.innerText = action.action_name;
            let btn_1 = document.createElement("button");
            btn_1.classList.add("btn");
            btn_1.innerText = "ok";
            attr_div.children[0].appendChild(txt_1);
            attr_div.children[0].appendChild(btn_1);
            btn_1.addEventListener("click", ()=> {
                attr_div.children[0].innerHTML = '';
                attr_div.classList.remove("open");
                attr_div.classList.add("collabse");
                attr_div.classList.add("set"); 
            });
          });
        });
    

    }
   


});

visualize_btn.addEventListener("click", ()=> {
    visualize_div.classList.remove('collabse');
    let x = document.createElement('p');
    x.classList.add('text');
    x.classList.add('x');
    x.innerText = "X";
   
    let h2 = document.createElement('h2');
    let h4 = document.createElement('h4');
    let h42 = document.createElement('h4');
    h2.innerText = 'System';
    h4.innerText = 'data';
    
    visualize_div.appendChild(x);
    visualize_div.appendChild(h2);
    visualize_div.appendChild(h4);
    for (let i=0; i < data.effectors.length; i++){
        let div = document.createElement('div');
        let com = document.createElement('p');
        com.classList.add('white-text');
        div.classList.add('horz');
        com.innerText = data.effectors[i].bone;
        let div2 = document.createElement('div');
        for(let j=0; j<data.effectors[i].value.length; j++){
            let txt = document.createElement('p');
            txt.classList.add('inline');
            txt.classList.add('text');
            txt.innerText = data.effectors[i].value[j];
            div2.appendChild(txt);
        }
        div.appendChild(com);
        div.appendChild(div2);
        visualize_div.appendChild(div);

    }
    h42.innerText = 'actions';
    visualize_div.appendChild(h42);

    for (let i=0; i < data.actions.length; i++){
        let div = document.createElement('div');
        let com = document.createElement('p');
        com.classList.add('white-text');
        div.classList.add('horz');
        com.innerText = data.actions[i].action_name;
        let div2 = document.createElement('div');
        let txt2 = document.createElement('p');
        txt2.classList.add("white-text");
        txt2.classList.add("inline");
        txt2.innerText = 'dominance ' + (Math.random() * Math.random());
        for(let j=0; j<data.actions[i].values.length; j++){
            let txt = document.createElement('p');
            txt.classList.add('inline');
            txt.classList.add('text');
            txt.innerText =  data.actions[i].values[j];
            div2.appendChild(txt);
            
        }
     
        div.appendChild(com);
        div.appendChild(txt2);
        div.appendChild(div2);
        visualize_div.appendChild(div);

    }
   
    

    x.addEventListener("click", () => {
       visualize_div.innerHTML = ''
        visualize_div.classList.add('collabse');
    });
});

function setattr () {
    let btn = document.createElement("button");
    let div = document.createElement("div");
    let div2 = document.createElement("div");
    let div3 = document.createElement("div");
    for(let i=0; i<data.effectors.length; i++){
        let text = document.createElement("p");
        let input = document.createElement("input");
        let label = document.createElement("label");
        input.id = data.effectors[i].bone;
        input.type = "number";
        input.classList.add("text");
        input.classList.add("inline");
        input.classList.add("y");
        input.value = .1;
        input.min = .01;
        input.step =.1;
        text.classList.add('text');
        text.innerText = data.effectors[i].bone;
        label.for = data.effectors[i].bone;
        label.innerText = "wieght.kg";
        div2.appendChild(text);
        div2.appendChild(label);
        div2.appendChild(input);
        
    }
    for(let i=0; i<data.groups; i++){
        let text = document.createElement("p");
        let input = document.createElement("input");
        let label = document.createElement("label");
        input.id =  'group.'+ i;
        input.type = "number";
        input.classList.add("text");
        input.classList.add("inline");
        input.classList.add("y");
        input.value = .1;
        input.min = .01;
        input.step =.1;
        text.classList.add('text');
        text.innerText = 'group.'+ i;
        label.for =   'group.'+ i;
        label.innerText = "strength.newton";
        div3.appendChild(text);
        div3.appendChild(label);
        div3.appendChild(input);
        
    }
    div.appendChild(div2);
    div.appendChild(div3);
    div.classList.add("inside-inside");
    btn.innerText = "close";
    btn.classList.add("btn");
    attr_div.children[0].appendChild(div);
    attr_div.children[0].appendChild(btn);
    btn.addEventListener("click", ()=> {
        attr_div.children[0].innerHTML = '';
        attr_div.classList.remove("open");
        attr_div.classList.add("collabse");
        attr_div.classList.add("set");
       
    });
}

function setData() {
    mech_comp.innerHTML = "";
    let text = document.createElement("p");
    let text2 = document.createElement("p");
    text.innerText = ">bones: " + data.bones;
    text2.innerText = ">muscle groups: " + data.groups;    
    mech_comp.appendChild(text);
    mech_comp.appendChild(text2);
}



window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});