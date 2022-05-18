class Inventory{

    init(){

        this.items = [0,0,0,0,0];
        this.maxItemNumber = 5;
        this.medicineQuantity = 0;
        this.leftPosInInventoryBase = ["18px", "98px", "177px", "256px", "335px"];
        this.inventoryDiv = document.getElementById("inventory");

    }

    deleteFromInventory(item, index){

        this.items[index-1] = 0;
        deleteFromArray(this.items, item);
        this.deleteImageFromInventory(item, index);

    }

    putInside(item){

        if(!this.isHaveSpace()){

            app.gameManager.popupMaker.createPopup("You not have enough space in inventory", "warning");

        }
        else{

            if(item.name == "medicine"){

                this.medicineQuantity++;

            }

            createjs.Sound.play("putInInventorySound");
            this.itemCanPutInIndex =  this.items.indexOf(this.items.find((item) => {return  item == 0;}));
            this.items[this.itemCanPutInIndex] = item;
            this.putImageInInventoryBase(item);
            this.maxItemNumber--;
            
        }

    }

    isHaveSpace(){

       return this.items.some((element)=>{ return element == 0});

    }

    createInventoryVisuals(){

        this.inventoryBase = document.createElement("img");
        this.inventoryBase.name = "inventoryBase";
        this.inventoryBase.src = "../assets/images/inventory.png"
        this.inventoryBase.style.width = "400px";
        this.inventoryDiv.appendChild(this.inventoryBase);
    }

    deleteImageFromInventory(item, index){

        this.image = document.querySelector("img[name =" + CSS.escape(index-1) + "]");

        this.inventoryDiv.removeChild(this.image);
        
    }

    putImageInInventoryBase(item){

        this.itemImage = document.createElement("img");
        
        if(item.name == "medicine"){

            this.itemImage.src = "../assets/images/medicine.png";
            this.itemImage.id = "medicine"
                
        }

        if(item.name == "grenade"){

            this.itemImage.src = "../assets/images/grenade.png";
            this.itemImage.id = "grenade"
                
        }

        this.itemImage.name = this.items.indexOf(item);
        this.itemImage.style.maxWidth = "50px";
        this.itemImage.style.position = "absolute";
        this.itemImage.style.bottom = "16px";
        this.itemImage.style.left = this.leftPosInInventoryBase[this.itemCanPutInIndex];
        this.itemImage.style.zIndex = "1001"

        this.inventoryDiv.appendChild(this.itemImage);

    }


}