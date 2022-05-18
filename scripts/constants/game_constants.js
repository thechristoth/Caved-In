const BARCOLORS = {
    GOLD: {
      color: 0xFFAA00,
      name: "gold"
    },
    IRON: {
       color: 0x8f8f8f,
       name: "iron" 
    }
    
}

const OFFLEDCOLOR = 0x9E0000;
const ONLEDCOLOR = 0x32a852;
const NOELECTRICITYCOLOR = 0x8f8f8f;

const GOLDMATERIAL = new THREE.MeshStandardMaterial ({color: BARCOLORS.GOLD.color, metalness: 1, roughness: 0.8});
const IRONMATERIAL = new THREE.MeshStandardMaterial ({color: BARCOLORS.IRON.color, metalness: 1, roughness: 0.8});
GOLDMATERIAL.name = BARCOLORS.GOLD.name;
IRONMATERIAL.name = BARCOLORS.IRON.name;

const MANUFACTURABLEITEMS = [

  {type:"500 Magnum", model: "magnumModel", materialNeedToProcess: {"wood" : 3, "iron" : 3, "gold": 0, "diamond": 0, "plant": 0, "magnum_part": 1}, timeToProcess: 7, angle: -Math.PI/2},
  {type:"ShotGun", model: "shotgunModel", materialNeedToProcess: {"wood": 5, "iron": 2, "gold": 0, "diamond": 0, "plant": 0, "shotgun_part": 1}, timeToProcess: 5, angle: -Math.PI/4},
  {type:"Ammo for 500 Magnum", model: "magnumAmmoModel",materialNeedToProcess: { "wood": 0,"iron": 2, "gold": 0, "diamond": 0, "plant": 2}, timeToProcess: 3, angle: Math.PI/2},
  {type:"Ammo for ShotGun",model: "shotgunAmmoModel", materialNeedToProcess: {"wood": 0, "iron": 1, "gold": 0, "diamond": 0, "plant": 1}, timeToProcess: 3, angle: Math.PI/4},
  {type:"Grenade", model: "grenadeModel", materialNeedToProcess: {"wood": 0, "iron": 1, "gold": 0, "diamond": 0, "plant": 1}, timeToProcess: 2, angle: -3*Math.PI/4},
  {type:"Medicine",model: "medicineModel", materialNeedToProcess: {"wood": 0, "iron": 0, "gold": 2, "diamond": 0, "plant": 2}, timeToProcess: 2, angle: 3*Math.PI/4},

];

const VISUAL_ASSETS = {
  
  fullMineModel: {src: '../assets/models/mine1.glb', type: "model"},
  magnumModel: {src: '../assets/models/magnum.glb', type: "model"},
  DoneMaterialBarModel: {src: '../assets/models/done_material_bar.glb', type: "model"},
  shotgunModel: {src: '../assets/models/shotgun.glb', type: "model"},  
  magnumAmmoModel: {src: '../assets/models/magnum_ammo.glb', type: "model"}, 
  shotgunAmmoModel: {src: '../assets/models/shotgun_ammo.glb', type: "model"},
  grenadeModel: {src: '../assets/models/grenade.glb', type: "model"},     
  wallDiffuseTexture: {src: '../assets/textures/diffusion/rock_texture_wall.jpg', type: "texture"},
  wallNormalTexture: {src: '../assets/textures/normal/wall_normal.jpg' , type: "texture"},
  groundVignetteTexture: {src: "../assets/textures/alpha/vignette_texture_ground.jpg", type: "texture"},
  lampInnerLightTexture: {src: "../assets/textures/diffusion/lamp_inner_light.png", type:"texture"},
  gunFireTexture: {src: "../assets/textures/diffusion/fire.png", type: "texture"},
  grenadeFireTexture: {src: "../assets/textures/diffusion/grenade_bomb.png", type: "texture"},
  groundDiffuseTexture: {src: "../assets/textures/diffusion/soil.png", type: "texture"},
  groundNormalTexture: {src: "../assets/textures/normal/ground_normal.jpg", type: "texture"},
  spiderModel: {src: "../assets/models/spider.glb", type: "model"},
  spiderBossModel: {src: "../assets/models/boss_spider.glb", type: "model"},
  mainDoorKey: {src: "../assets/models/key.glb", type: "model"},
  medicineModel: {src: "../assets/models/medicine.glb", type: "model"},

};

const SOUND_ASSETS = {
  pickupOilLampSound: {src: "../assets/sounds/pickup_oil_lamp.mp3", type: "sound"},
  putInGoundSound: {src: "../assets/sounds/put_in_ground.mp3", type: "sound"},
  lockOpenSound: {src: "../assets/sounds/lock_open.mp3", type: "sound"},
  putInMachineSound: {src: "../assets/sounds/put_in_machine.mp3", type: "sound"},
  arrowSound: {src: "../assets/sounds/arrow_sound.mp3", type: "sound"},
  bigSwitchSound: {src: "../assets/sounds/big_switch.mp3", type: "positionalSound"},
  grenadeSound: {src: "../assets/sounds/grenade.mp3", type: "sound"},
  itemSound: {src: "../assets/sounds/item.mp3", type: "sound"},
  pickupThings: {src: "../assets/sounds/pickup_things.mp3", type: "sound"},
  shotgunShootSound: {src: "../assets/sounds/shotgun.mp3", type: "sound"},
  putInInventorySound: {src: "../assets/sounds/put_in_inventory.mp3", type: "sound"},
  shotgunReloadSound: {src: "../assets/sounds/shotgun_reload.mp3", type: "sound"},
  missionCompletedSound: {src: "../assets/sounds/mission_completed.mp3", type: "sound"},
  magnumShootSound: {src: "../assets/sounds/magnum.mp3", type: "sound"},
  madicineSound: {src: "../assets/sounds/madicine.mp3", type: "sound"},
  magnumReloadSound: {src: "../assets/sounds/magnum_reload.mp3", type: "sound"},
  failToUnlockDoorSound: {src: "../assets/sounds/fail_unlock_door.mp3", type: "sound"},
  doorOpenSound: {src: "../assets/sounds/door_open.mp3", type: "sound"},
  pullWoodSound: {src: "../assets/sounds/pull_wood.mp3", type: "sound"},
  electricitySound: {src: "../assets/sounds/electricity.mp3", type: "sound"},
  putInHandSound: {src: "../assets/sounds/put_in_hand.mp3", type: "sound"},
  changeItemInHandSound: {src: "../assets/sounds/change_item_in_hand.mp3", type: "sound"},
  playerDiedSound: {src: "../assets/sounds/player_died.mp3", type: "sound"},
  pickupKeySound: {src: "../assets/sounds/key_sound.mp3", type: "sound"},
  playerDamageSound: {src: "../assets/sounds/player_damage.mp3", type: "sound"},
  machineSound: {src: "../assets/sounds/machine_sound.mp3", type: "positionalSound"},
  spiderAttackSound: {src: "../assets/sounds/spider_attack.mp3", type: "positionalSound"},
  spiderCrunchSound: {src: "../assets/sounds/spider_crunch.mp3", type: "positionalSound"},
  spiderShootSound: {src: "../assets/sounds/spider_shoot.mp3", type: "positionalSound"},
  spiderDamageSound: {src: "../assets/sounds/spider_damage.mp3", type: "positionalSound"},
  spiderDieSound: {src: "../assets/sounds/spider_die.mp3", type: "positionalSound"},
  spiderBossShootSound: {src: "../assets/sounds/spider_boss_shoot.mp3", type: "positionalSound"}
}

const ROCKS = [

  {type:"rawIron", coalNeedToProcess: 1, timeToProcess: 3, processedMaterial: IRONMATERIAL},
  {type:"rawGold", coalNeedToProcess: 2,timeToProcess: 5, processedMaterial: GOLDMATERIAL},

];

const MISSIONS = [

  "grab_the_lamp_with_E_button", "process_iron_rock", "find_shotgun_part", "manufacture_shotgun", "manufacture_ammo_for_shotgun", "find_and_defeat_all_spiders",
   "find_the_main_power_switch_and_turn_it_on", "find_magnum_part", "manufacture_magnum", "manufacture_ammo_for_magnum", "find_and_kill_the_boss_and_get_the_key", "open_the_main_door"

];

const PAGES = {
  game: {href: '/pages/game.html'}
}
const ENEMYCOORDS = {

  first_stage: [{x: -35, z: 0}, {x: 50, z:-50}, {x: 150, z: 17}, {x: 110, z: 0}, {x:-86, z:1}, {x:130, z:-10}, {x:86, z:-28}],
  
  second_stage: [{x: 128, z: -61}, {x: 47, z: -47}, {x: 31, z: -114}, {x: 48, z: -90}, {x: 97, z: -47}, {x: -35, z: 0},
     {x: 50, z:-50}, {x: 150, z: 17}, {x: 110, z: 0}, {x:-86, z:1}, {x:130, z:-10}, {x:86, z:-28}],

  third_stage: [{x: 88, z: 50}, {x: 88, z: 73}, {x: 151, z: 41}, {x: 124, z: 66},
    {x: 128, z: -61}, {x: 47, z: -47}, {x: 31, z: -114}, {x: 48, z: -90}, {x: 97, z: -47}, {x: -35, z: 0},
    {x: 50, z:-50}, {x: 150, z: 17}, {x: 110, z: 0}, {x:-86, z:1}, {x:130, z:-10}, {x:86, z:-28}]

}
