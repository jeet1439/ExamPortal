import React, { useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useMediaQuery } from "react-responsive";

const CircleLoader = ({
  className = `circleloader`,
  meshColor = `#6366F1`,
  lightColor = `#FFFFFF`,
  lightIntensity = 0.4,
  ambientLightColor = `#E8EBFB`,
  duration = 1,
  size = `64px`,
  desktopSize = ``,
  mobileSize = ``,
}) => {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  let sizeFound = 0.0;
  if (isDesktopOrLaptop) {
    if (desktopSize !== "") sizeFound = parseFloat(desktopSize);
    else sizeFound = parseFloat(size) * 2;
  }
  if (isTabletOrMobile) {
    if (mobileSize !== "") sizeFound = parseFloat(mobileSize);
    else sizeFound = parseFloat(size);
  }

  let sizePassed = parseFloat(sizeFound);
  let sizeCanvas = (sizePassed * 220) / 64;

  useEffect(() => {
    const $ = (s, o = document) => o.querySelector(s);

    let width = sizeCanvas,
      height = sizeCanvas,
      canvas = $("." + className),
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: canvas.getContext("webgl2"),
        antialias: true,
        alpha: true,
      }),
      shape = (inner = 13, outer = 20, height = 6, segments = 60) => {
        let arc = new THREE.Shape(),
          hole = new THREE.Path();

        arc.moveTo(outer, 0);
        arc.absarc(0, 0, outer, 0, Math.PI * 2, false);

        hole.moveTo(inner, 0);
        hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
        arc.holes.push(hole);

        let geometry = new THREE.ExtrudeGeometry(arc, {
            depth: height,
            bevelEnabled: false,
            curveSegments: segments,
          }),
          material = new THREE.MeshLambertMaterial({
            color: meshColor,
          }),
          object = new THREE.Mesh(geometry, material),
          proxy = new Proxy(
            {
              z: null,
              s: null,
            },
            {
              set(target, key, value) {
                target[key] = value;
                if (target.z !== null) {
                  object.position.z = target.z;
                }
                if (target.s !== null) {
                  object.scale.x = target.s;
                  object.scale.y = target.s;
                }
                return true;
              },
              get(target, key) {
                return target[key];
              },
            }
          );

        object.castShadow = true;
        object.receiveShadow = true;

        return {
          geometry: geometry,
          object: object,
          proxy: proxy,
        };
      };

    renderer.setSize(width, height);
    renderer.setPixelRatio(2);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(17, width / height, 0.1, 1000);

    camera.position.z = 100;
    camera.position.y = -160;
    camera.rotation.x = THREE.MathUtils.degToRad(60);

    let planeGeometry = new THREE.PlaneGeometry(200, 200),
      planeMaterial = new THREE.ShadowMaterial();

    planeMaterial.opacity = 0.1;

    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 6;
    plane.receiveShadow = true;

    scene.add(plane);

    let lightTop = new THREE.DirectionalLight(lightColor, lightIntensity);
    lightTop.position.set(100, 100, 200);
    lightTop.castShadow = true;

    let d = 40;
    lightTop.shadow.camera.left = -d;
    lightTop.shadow.camera.right = d;
    lightTop.shadow.camera.top = d;
    lightTop.shadow.camera.bottom = -d;

    lightTop.shadow.radius = 8;

    scene.add(lightTop);

    scene.add(new THREE.AmbientLight(ambientLightColor));

    // Setup

    let first = shape(),
      second = shape(),
      third = shape();

    scene.add(first.object);
    scene.add(second.object);
    scene.add(third.object);

    first.proxy.s = 0.8;

    second.proxy.z = 9;
    second.proxy.s = 0.55;

    third.proxy.z = 18;
    third.proxy.s = 0.35;

    // Animate

    gsap.to(first.proxy, {
      repeat: -1,
      duration: duration,
      keyframes: [
        {
          z: 9,
          s: 0.95,
        },
        {
          z: 18,
          s: 0.35,
        },
        {
          z: 0,
          s: 0.3,
        },
        {
          z: 0,
          s: 0.8,
          delay: -0.1,
        },
      ],
    });

    gsap.to(second.proxy, {
      repeat: -1,
      duration: duration,
      keyframes: [
        {
          z: 10,
          s: 0.5,
        },
        {
          z: 0,
          s: 0.5,
        },
        {
          z: 4,
          s: 0.65,
        },
        {
          z: 8,
          s: 0.55,
        },
      ],
    });

    gsap.to(third.proxy, {
      repeat: -1,
      duration: duration,
      keyframes: [
        {
          z: 0,
          s: 0.3,
        },
        {
          z: 0,
          s: 0.8,
          delay: -0.1,
        },
        {
          z: 9,
          s: 0.95,
        },
        {
          z: 18,
          s: 0.35,
        },
      ],
    });
    let render = () => {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    };
    render();
  }, []);
  return <canvas className={className}></canvas>;
};

export default CircleLoader;