class MissionManager{

    init(){

        this.missions = MISSIONS;
        app.gameManager.popupMaker.createPopup("Your first mission is: " +  this.missions[0].replaceAll("_", " ").bold(), "new_mission");
        app.gameManager.popupMaker.createPopup("Press I button".bold() +", to see the controls!", "info");
        this.onceUnclockNewArea = true;
        this.onceShotgunAmmoMission = true;
        this.onceMagnumAmmoMission = true;

    }

    nextMission(missionCompleted){

        if(this.missions.indexOf(this.missions[this.missions.indexOf(missionCompleted)+1]) > -1){
            

            if(missionCompleted == "manufacture_ammo_for_shotgun"){

                app.enemyManager.startSpiderAction(3);

            }

            if(missionCompleted == "find_and_defeat_all_spiders" || missionCompleted == "find_magnum_part"){
                app.chunkManager.chunks.forEach(chunk => {

                    if(chunk.barriers.length > 0){

                        chunk.barriers.forEach(barrier => {
                            if(barrier.obj3d.name.startsWith("barrier_to_current") && missionCompleted == "find_and_defeat_all_spiders"){
                                barrier.destroy();
                                deleteFromArray(chunk.barriers, barrier);
                                if(this.onceUnclockNewArea){
                                    this.onceUnclockNewArea = false;
                                    app.gameManager.popupMaker.createPopup("Congratulation, you have unlocked " + "new area".bold(), "mission_completed");
                                    app.enemyManager.enemyStage = "second_stage";
                                }

                            }
                            else if(barrier.obj3d.name.startsWith("barrier_to_gold") && missionCompleted == "find_magnum_part"){
                                this.onceUnclockNewArea = true;
                                barrier.destroy();
                                deleteFromArray(chunk.barriers, barrier);
                                if(this.onceUnclockNewArea){
                                    this.onceUnclockNewArea = false;
                                    app.gameManager.popupMaker.createPopup("Congratulation, you have unlocked " + "new area".bold(), "mission_completed");
                                    app.enemyManager.enemyStage = "third_stage";
                                }
                            }
                        })

                    }

                });

                if(missionCompleted == "find_and_defeat_all_spiders"){

                    app.world.isHaveCurrent = false;

                }

            }

            if(missionCompleted == "manufacture_ammo_for_magnum"){

                this.boss = app.enemyManager.waitForSpiderObject(90, 60, true);

            }

            this.completedMissionIndex = this.missions.indexOf(missionCompleted);

            deleteFromArray(this.missions, missionCompleted);

            this.completeMission(missionCompleted);

            if(this.completedMissionIndex > 1){

                
            }
            else{
                app.gameManager.popupMaker.createPopup("The next mission is: "+ (this.missions[0]).replaceAll("_", " ").bold(), "new_mission");
            }

        }

    }

    completeMission(mission){

        app.gameManager.popupMaker.createPopup("Congratulation, you have completed this mission: "+  mission.replaceAll("_", " ").bold(), "mission_completed");
        createjs.Sound.play("missionCompletedSound");


    }

}