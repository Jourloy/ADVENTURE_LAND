setInterval(function(){
	if (!character.party) {
    	if (get_player("HIVEwarrior")) accept_party_invite("HIVEwarrior");
    }
	
	if (get_player("HIVEwarrior")) {
		if (character.items[41] != null) send_item("HIVEwarrior", 41, character.items[41].q)
		if (character.gold > 0) send_gold(get_player("HIVEwarrior"), character.gold);
	}
},1000/4);