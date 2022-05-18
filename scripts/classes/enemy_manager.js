class EnemyManager{

    init(){

        this.enemyStage = "first_stage";

        this.waveCounter = 0;
        this.enemies = [];
        this.spiderMissionDone = false;
        this.once = true;
      

    }

    createSpider(x, z, isBoss){

        this.spider = new Spider();
        this.spider.init(x, z, isBoss);
        return this.spider;

    }

    deleteEnemy(enemy){

        deleteFromArray(this.enemies, enemy);

        if(this.enemies.length == 0){

            this.spiderMission();
            
        }
    }

    startSpiderAction(count){

        this.waveCounter++;

        if(count <= ENEMYCOORDS[this.enemyStage].length){

            ENEMYCOORDS[this.enemyStage].forEach((coord, index) => {

                if(count > index){

                    this.spiderObj = this.waitForSpiderObject(coord.x, coord.z, false);
    
                }

            })
        }

    }

    async waitForSpiderObject(x,z, isBoss){

        this.spiderObj = await this.createSpider(x,z,isBoss);
        this.enemies.push(this.spiderObj)
        return this.spiderObj;
    }

    spiderMission(){

        if(this.waveCounter < 2){
            setTimeout(()=>{
                this.startSpiderAction(getRndInteger(1, ENEMYCOORDS[this.enemyStage].length));
            },getRndInteger(1000, 10000));
        }
        else if(this.waveCounter == 2 && !this.spiderMissionDone){
            app.missionManager.nextMission("find_and_defeat_all_spiders");
            this.spiderMissionDone = true;
        }

    }

    update(){

        if(this.enemies.length > 0){

            this.enemies.forEach((enemy) => {

                if(enemy.life <= 0 && !enemy.dead){

                    enemy.death(enemy);
                    enemy.dead = true;
                    
                }
                
            });

        }
        
        if(this.spiderMissionDone && this.enemies.length == 0 && this.once){

            this.once = false;

            setTimeout(()=>{
                this.startSpiderAction(getRndInteger(1, ENEMYCOORDS[this.enemyStage].length));
                this.once = true;
            },getRndInteger(18000, 40000));

        }

    }
    
}