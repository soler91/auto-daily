const Wait_time = 30, // Time in seconds after loading  
      Load_time = 3; // Time in seconds

const Command = require('command')
    
module.exports = function test(dispatch) {

const command = Command(dispatch)

let Daily_Boxes = [169660, 180675], // Deliver Elite Gift box , Deliver Elite Consumable Box
    slots = [];

    dispatch.hook('S_LOAD_CLIENT_USER_SETTING', 1, () => {
        if(slots.length > 0){
        setTimeout(function(){ command.message('Claiming Dailies in ' + Wait_time + ' seconds.'); }, Load_time);
        setTimeout(claimItems, (Wait_time+Load_time)*1000);
        }
    });

	dispatch.hook('S_PCBANGINVENTORY_DATALIST', 1, event => {
        for(let item of event.inventory){
			if(Daily_Boxes.includes(item.item) && item.amount == 1 && !slots.includes(item.slot)) {
				slots.push(item.slot);
				return true;
			}
        }
    });
    
    function claimItems(){
        dispatch.toServer('C_REQUEST_RECV_DAILY_TOKEN', 1, {});
        for(let slot of slots){
            dispatch.toServer('C_PCBANGINVENTORY_USE_SLOT', 1, {
                slot: slot
            });
        }
        command.message('Claimed Dailies.')
        slots = [];
    }
}
