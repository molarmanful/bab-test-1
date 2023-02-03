import * as B from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core'
import '@babylonjs/loaders'
import handURL from './assets/hand.stl'
import normURL from './assets/normal.jpg'
// import envURL from './assets/environment.env'

let createScene = async (canvas, cb = _ => { }) => {
  let dpiScale = 1
  let engine = new B.Engine(canvas, true)
  engine.setHardwareScalingLevel(devicePixelRatio / dpiScale)
  let scene = new B.Scene(engine)
  scene.clearColor = B.Color3.Black().toLinearSpace()
  // scene.environmentTexture = B.CubeTexture.CreateFromPrefilteredData(envURL, scene)

  let camera = new B.ArcRotateCamera('camera', 0, Math.PI / 3, 100, B.Vector3.Zero(), scene)
  camera.fov = .1
  camera.panningSensibility = 0
  camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius
  camera.lowerBetaLimit = camera.upperBetaLimit = camera.beta
  camera.attachControl(canvas, true)

  let pipe = new B.DefaultRenderingPipeline('pipe', true, scene, [camera])
  pipe.samples = 4
  pipe.chromaticAberrationEnabled = true
  pipe.chromaticAberration.aberrationAmount = 6
  pipe.grainEnabled = true
  pipe.grain.animated = true
  pipe.bloomEnabled = true

  // let light = new B.HemisphericLight('light', new B.Vector3(0, 1, .5), scene)
  let dir = new B.Vector3(-1, -4, -2)
  let hlight = new B.HemisphericLight('light', dir.scale(-1), scene)
  hlight.intensity = .1
  let light = new B.DirectionalLight('light', dir, scene)
  light.intensity = 1.4
  let shadow = new B.CascadedShadowGenerator(2048, light)
  shadow.usePercentageCloserFiltering = true
  // shadow.stabilizeCascades = true
  shadow.lambda = 1
  shadow.cascadeBlendPercentage = 0
  shadow.shadowMaxZ = camera.maxZ
  shadow.depthClamp = true
  shadow.autoCalcDepthBounds = true

  // let gl = new B.GlowLayer('glow', scene, {
  //   mainTextureSamples: 4,
  // })

  let meshImports = await B.SceneLoader.ImportMeshAsync('hand', handURL, void 0, scene, null, '.stl')
  let hand = meshImports.meshes[0]
  hand.position = new B.Vector3(-1, -2, 1)
  hand.rotation = new Vector3(0, Math.PI / 3, -.2)
  hand.scaling = Vector3.One().scale(.02)
  shadow.getShadowMap().renderList.push(hand)
  hand.receiveShadows = true

  let hMat = new B.StandardMaterial('', scene)
  hand.material = hMat

  // let sphereSize = 2
  // let sphere = B.MeshBuilder.CreateSphere('sphere', { diameter: sphereSize * 2 }, scene)
  // shadow.getShadowMap().renderList.push(sphere)
  // sphere.receiveShadows = true

  let ground = B.MeshBuilder.CreateDisc('ground', { radius: 20 }, scene)
  ground.position = new B.Vector3(0, -2, 0)
  ground.rotation = new B.Vector3(Math.PI / 2, 0, 0)
  ground.receiveShadows = true

  let gMat = new B.StandardMaterial('', scene)
  gMat.diffuseColor = B.Color3.FromHexString('#111111')
  let noise = new B.NoiseProceduralTexture('', 1024, scene)
  noise.brightness = .95
  noise.octaves = 16
  noise.persistence = 1
  noise.animationSpeedFactor = 1
  gMat.diffuseTexture = noise
  ground.material = gMat

  engine.runRenderLoop(() => {
    scene.render()
  })

  addEventListener('resize', _ => {
    engine.resize()
  })

  cb({ engine, scene })
}

export { createScene }