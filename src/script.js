import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'
import * as anime from 'animejs/lib/anime'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Lights

  // Создание группы для СВЕТОВ!
  const lightHolder = new THREE.Group();

  // Создание простого Света!
  const aLight=new THREE.DirectionalLight(0xffffff,2);

  // Установка позиции для этого света
  aLight.position.set(-1.5,1.7,.7); //[по Z, по У, по Х ]

  // Прикрепляем к удержателю позиции света, чтобы он дальше не крутился вместе с объектами на сцене
  lightHolder.add(aLight);

  // Второй дополнительный свет
  const aLight2=new THREE.DirectionalLight(0xffffff,2);
  aLight2.position.set(-1.5,0.3,.7); //[по Z, по У, по Х ]
  lightHolder.add(aLight2);
  


  const geometry = new THREE.IcosahedronGeometry(1.0,2);

  // Создание материала для икосахедрона (сферы)
  const materialIcosahedron = new THREE.MeshBasicMaterial({
    opacity: 0,
    transparent: true
  });

  // Создание некоторого абстрактного объекта (переводится — сетка)
  const mesh = new THREE.Mesh(geometry,materialIcosahedron);
  // Установим родителя для всех элементов, к которым будет далее применена некоторая анимация...
  const parent=mesh;

  // Создание сферы, которую мы будем видеть — для скрытия заднего вида самой карты
  const geomHide = new THREE.SphereBufferGeometry(1.0499, 64, 36);
  const matHide=new THREE.MeshStandardMaterial({color:new THREE.Color(0x091e5a)}); //0x340345
  const meshHide= new THREE.Mesh(geomHide, matHide);

  //Добавляем объекты на сцену
  scene.add(meshHide);
  scene.add(lightHolder);

  scene.add(mesh) // Добавил основной прозрачный (скрытый от глаз объект на сцену), он послужит «родителем» для остальных...
  // Функция добавления данных на карту планеты
  

  function addMapInf(posCil1,posCir2,main=false){
    // Принимает парамерты://posCil1 => array(1,2,3)//posCil2 => array(1,2,3)//main => boolean
    let mainSize=null// если main = true, то значит это ПЕРВЫЙ «флагшток» (освновная позиция на карте)
    let mSC=null// размер круга под цилиндром
    let color=0x008DFB;//цвет по умолчанию — это цвет НЕглавных «флагштоков»
    if(main){// если это первый «флагшток»
        mainSize=[.004,.004,.3,3];
        mSC=[.017,24];
        color=0x86c3f9
    }else{ // если остальные флагштоки, то их размер чуть меньше основного
        mainSize=[.002,.002,.16,4]
        mSC=[.01,12]
    };
      // Создание цилиндра
      const cyl=new THREE.CylinderBufferGeometry(mainSize[0],mainSize[1],mainSize[2],mainSize[3]);
      const cylinder=new THREE.Mesh(
        cyl,
        new THREE.MeshBasicMaterial({color})
      );
      
      // Нет необходимости направлять цилиндр к центру
      //cylinder.lookAt(new THREE.Vector3());

      cylinder.position.set(posCil1[0],posCil1[1],posCil1[2]);

      //scene.add(cylinder);// Добавим на сцену — это можно НЕ делать, так как мы и так добавим это на сцену кодом ниже
      parent.add(cylinder);// Добавим к родительскому элементу для дальнейшей анимации (в других уроках)

      // Видимо, далее по коду моей планеты, есть место, где мне необходим только лишь цилиндр (без круга внизу)
      if(posCir2==''){return [cylinder]}

      // Создаём окружность под цилиндром
      const circLocation = new THREE.CircleBufferGeometry(mSC[0],mSC[1]);

      // «Засунем» цилиндр в mesh и применим к нему материал...
      const circleLocation = new THREE.Mesh(
          circLocation,
          new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide})
      );

      // Устанавливаем ему позицию — с помощью заранее определённых данных
      circleLocation.position.set(posCir2[0],posCir2[1],posCir2[2]);

      //Указываем ему «смотреть» в начало координат (нулевую точку), чтобы он как бы был над поверхностью планеты
      circleLocation.lookAt(new THREE.Vector3());

      //scene.add(circleLocation);

      // Добавляем окружность под цилиндром
      parent.add(circleLocation);

      // Функция возвращает два объекта в виде массива
      // Объекты представляют из себя ранее созданные 3D-объекты — JS Object
      return [cylinder,circleLocation]
  }

    // Вызываю функцию создания элемнтов карты («флагшток №1»)
    //                данные определил заранее, руками, попробуйте их менять — увидите, как это трудно
/*     const c1=addMapInf([.66,.95,-.28],[.662,.8,-.28],true)

    // Анимирую появление «флагштока» — высокого цилиндра
    anime({
      targets:c1[0].scale,// указываем цель анимации — «scale» — увеличение чего-то
      x:[0,1],// увеличивает с 0 до 1 по оси X
      y:[0,1],// увеличивает с 0 до 1 по оси Y
      z:[0,1],// увеличивает с 0 до 1 по оси Z
      duration:2000,// время выполнения самой анимации
      delay:1100,// задержка перед выполнением анимации
      easing:'easeOutBounce' // тип перехода анимации — лучше всего выбирать «linear»
    }); */

    // Анимирую появление круга под цилиндром
//    anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:2000,easing:'linear'});

  /* \ !!!WARN!!! Planet 2-2 */

    /* !!!WARN!!! Planet 2-3 */
    /* Text */
    const fontLoader=new THREE.FontLoader();
    fontLoader.load('fonts/font-roboto.json', font =>{
        function createText(text,pos,rot,size,font,color=0xffffff){
          text=new String(text);
          const textGeo = new THREE.TextGeometry(text,{
            font,
            size,
            height: .008,
            curveSegments: 12,
            /* bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5 */
          } );
          const textMaterial=new THREE.MeshBasicMaterial({
              color,
              side:THREE.FrontSide
          });
          text=new THREE.Mesh(textGeo,textMaterial);
          text.position.set(pos[0],pos[1],pos[2]);
          text.rotation.set(rot[0],rot[1],rot[2]);
          /* text.updateMatrix(); */
          scene.add(text);
          parent.add(text);
          return text;
      }
      const txt1=createText('The center of the earth',[.617,.97,-.14],[0,1.95,0],.03,font);
      const txt2=createText('Saint-Petersburg',[.617,.91,-.14],[0,1.95,0],.03,font,0x84B3DF);
        const mainPos=[.662,.8,-.28];
        anime.timeline().add({
            targets:txt1.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
        }).add({
            targets:txt2.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,delay:100,easing:'linear',complete:()=>{
                //(main)
                let c1=addMapInf([.66,.95,-.28],mainPos,true);
                anime({targets:c1[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
            }
          })
    });
    //\TEXT+
    /* \ !!!WARN!!! Planet 2-3 */

      /* !!!WARN!!! Planet 2-4 */

      const loader = new THREE.TextureLoader();

      // load a resource
      loader.load(
        'media/logo.png',
        function ( texture ) {
            const material = new THREE.MeshBasicMaterial( {
                map: texture,
                side: THREE.DoubleSide,
                alphaTest:.6
            });
            const meshTexture = new THREE.Mesh(
                new THREE.PlaneGeometry(.435,.1),
                material
            );
            meshTexture.position.set(.62,1.05,-.47);
            meshTexture.rotation.set(0,1.95,0);
            meshTexture.scale.set(0,0,0);
            scene.add(meshTexture)
            parent.add(meshTexture)
            anime({targets:meshTexture.scale,x:[0,.7],y:[0,.7],z:[0,1],duration:600,easing:'linear'})
          },
          undefined,
          function ( e ) {
              console.error( e );
          }
      );

       /* !!!WARN!!! Planet 2-5 */
        // Массив точек для «бум» — это в след. уроках..
        const circlePointsAr=[
          //(main)
          [.662,.775,-.28],
          [.63,.84,-.13],//lux
          [.89,.55,-.2139],
          [.54,.75,.5],//Lond
          [-.2138805, .773827135, .692131996],//usa 2
          [-.7738271,.69213199,.21388055],//usa
          [.25,.33,-.968],//hong
          [.53,-.02,-.92]
      ];

        let meshCircles=null; // Переменная для самой карты
        /* Строим саму карту планеты из «кружочков» */
        const obj={};// Создадим объект, чтобы в него «складывать» переменные
        obj.w=360;// Обозначим кратную размеру map.png ширину будущего canvas
        obj.h=180;// ~ высоту ~
        obj.d=document;// Для псевдонима document (чтобы каждый раз его не писать)
        obj.c=obj.d.createElement('canvas');// Создание canvas, в который будем помещать точки из PNG изображения и брать их для нашей карты планеты
        obj.cnt=obj.c.getContext('2d');// Установим контекст 2d, а не webgl
        obj.c.width=obj.w;// Ширина canvas
        obj.c.height=obj.h;// Высота ~
        obj.c.classList.add('tmpCanvas');// Добавим класс для нового объекта canvas в HTML коде страницы, чтобы обратиться к нему далее
        obj.d.body.appendChild(obj.c);// Добавим его в документ
    
        obj.s=obj.d.createElement('style');// Создадим стиль
        obj.s.innerText=`.tmpCanvas{position:absolute;z-index:-9;width:0;height:0;overflow:hidden}`;// Сам CSS-код позиционирования нового canvas — скрываем его с глаз
        obj.d.body.appendChild(obj.s);// Добавляем стили в document
        obj.img=new Image();// Создадим объект класса Image (нативный JS)
        obj.img.src='media/map.png';// Присвоем ему путь к изображению
        obj.img.onload=()=>{// Когда загрузится... выполним код ниже
            obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h) // Нарисуем изображение на canvas из PNG файла
            obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h)  
            obj.data = obj.data.data;// Возьмём точки из canvas
            obj.ar=[];
            // ** Код ниже для shader (для будущих уроков)
            const impacts = [];
            for (let i = 0; i < circlePointsAr.length; i++) {
                impacts.push({
                    impactPosition:new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]),
                    impactMaxRadius: THREE.Math.randFloat(0.0001, 0.0002),
                    impactRatio: 0.01
                });
            }
            let uniforms = {
                impacts: {value: impacts}
            }
            // \ **

            // Важный код. Наполним массив точками из данных из canvas
            for(let y = 0; y < obj.w; y++) {// по оси Y
                for(let x = 0; x < obj.w; x++) {// по оси X
                    const a=obj.data[((obj.w*y)+x)*4+3];// берём только n-нные значения
                    if(a>200){
                        obj.ar.push([x-obj.w,y-obj.w/6.2])// здесь 6.2 — это как бы «отступ от севера»
                    }
                }
            }
            // https://r105.threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html
            // RU: https://stepik.org/lesson/582241/step/1?unit=576975
            const lonHelper = new THREE.Object3D();
            scene.add(lonHelper);
            // We rotate the latHelper on its X axis to the latitude
            const latHelper = new THREE.Object3D();
            lonHelper.add(latHelper);
            // The position helper moves the object to the edge of the sphere
            const positionHelper = new THREE.Object3D();
            positionHelper.position.z = .5;
            // positionHelper.position.z = Math.random();
            latHelper.add(positionHelper);
            // Used to move the center of the cube so it scales from the position Z axis
            const originHelper = new THREE.Object3D();
            originHelper.position.z=.5;
            positionHelper.add(originHelper);
            const lonFudge=Math.PI*.5;
            const latFudge=Math.PI*-0.135;
            const geometries=[];
    

            obj.nAr=[];
            obj.counter=0;
            obj.counter2=0;

            // Материал с шейдером, который поможет скруглить PlaneBufferGeometry и анимировать, сделать «бум»
            const materialCircles=new THREE.MeshBasicMaterial({
                color:0xffffff,
                side:THREE.FrontSide,
                onBeforeCompile: shader => {
                    shader.uniforms.impacts = uniforms.impacts;
                    shader.vertexShader = `
            struct impact {
              vec3 impactPosition;
              float impactMaxRadius;
              float impactRatio;
            };
            uniform impact impacts[${circlePointsAr.length}];
            attribute vec3 center;
            ${shader.vertexShader}
          `.replace(
                        `#include <begin_vertex>`,
                        `#include <begin_vertex>
            float finalStep = 0.0;
            for (int i = 0; i < ${circlePointsAr.length};i++){
    
              float dist = distance(center, impacts[i].impactPosition);
              float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio/2.;
              float sstep = smoothstep(0., curRadius*1.8, dist) - smoothstep(curRadius - ( .8 * impacts[i].impactRatio ), curRadius, dist);
              sstep *= 1. - impacts[i].impactRatio;
              finalStep += sstep;
    
            }
            finalStep = clamp(finalStep*.5, 0., 1.);
            transformed += normal * finalStep * 0.25;
            `
                    );
                    //console.log(shader.vertexShader);
                    // Этот кусочек кода отвечает за «цветовой» шейдер, который и будет скруглять наш PlaneBufferGeometry
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `vec4 diffuseColor = vec4( diffuse, opacity );`,
                        `
            if (length(vUv - 0.5) > 0.5) discard;
            vec4 diffuseColor = vec4( vec3(.7,.7,.7), .1 );
            `);
                }
    
            });
            materialCircles.defines = {"USE_UV" : ""};
    
            let uty0=0
            // Проходимся по массиву наших точек («кружочков»)
            obj.ar.map(e=>{
                uty0++
                obj.counter2++;
                const geometry=new THREE.PlaneBufferGeometry(0.005,0.005);
                // Позиционирование «кружочков»
                // +15 — вращаем на 15 градусов западнее, хотя это можно было сделать иначе — вращать уже весь объект, а не каждый из «кружочков»
                // degToRad — https://threejs.org/docs/#api/en/math/MathUtils.degToRad
                lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+lonFudge+15;
                const w=latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+latFudge;
                if(w-obj.prewLatX===0/*&&obj.counter2%2==0*/){
                    originHelper.updateWorldMatrix(true,false);// ЭТА
                    geometry.applyMatrix4(originHelper.matrixWorld);// и ЭТА штуки необходимы для обновления позиции отдельного «кружочка»
                    // Код ниже для анимирования «бум»
                    geometry.setAttribute("center", new THREE.Float32BufferAttribute(geometry.attributes.position.array, 3));
                    // Добавим вновь созданный «кружочек» в массив
                    geometries.push(geometry);
                }
                obj.prewLatX=w;
            });
            //Сформируем лишь одну буферную геометрию (которая по-идее должна обрабатываться на видео карте)
            //из массива ранее сформированных «кружочков»
            const geometryCircles = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
            meshCircles = new THREE.Mesh(geometryCircles, materialCircles);
            // ниже тестовый материал, чтобы можно было увидеть НЕ «кружочки», а реальные PlaneBufferGeometry
            //meshCircles = new THREE.Mesh(geometryCircles, new THREE.MeshBasicMaterial({color:0xffffff}));

            // Добавим на сцену наш новый объект (саму карту)
            scene.add(meshCircles);

            //Добавим новый объект (саму карту) к родительскому элементу
            parent.add(meshCircles);

            // Немного увеличим наш новый объект, чтобы все «кружочки» были над поверхностью планеты
            meshCircles.scale.set(1.051,1.051,1.051)
    
            obj.c.remove();// Удалим временный canvas из которого брали точки
            obj.s.remove()// Удалим временные стили
          }
        /* \ !!!WARN!!! Planet 2-5 */
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(12, sizes.width / sizes.height, 0.1, 200)
camera.position.set(10.5,4,-3.5);
camera.setViewOffset(22.46, 10, -2, .5, 17, 9)
//[расположение по Х, расположение по Z,]
scene.add(camera)

// Controls
 const controls = new OrbitControls(camera, canvas)
 controls.enableDamping = true
 controls.dampingFactor = .01;

 controls.minPolarAngle =1.2;
 controls.maxPolarAngle = 1.2;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#000', 1);

/**
 * Animate
 */

const clock = new THREE.Clock()
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime / 50

    /* function rotateRadians(deg){
      return deg * (Math.PI / 180);
    }
    animejs({
      loop: true,
      targets: mesh.rotation,
      // z: [rotateRadians(360), rotateRadians(0)],
      //x: [rotateRadians(360), rotateRadians(0)],
      y: [rotateRadians(-360), rotateRadians(360)],
      duration: 2000,
      easing: "linear"
    }); */

    // Render
    renderer.render(scene, camera)

    lightHolder.quaternion.copy(camera.quaternion);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    lineMesh.forEach(e=>{
        e.material.uniforms.dashOffset.value -= 0.01
    });
    TWEEN.update();
}

tick();
// стили, скрывающие прокрутку
const d_=document;
const s_=d_.createElement('style');
s_.innerText=`
body{margin:0;overflow:hidden}
`;
d_.body.appendChild(s_)